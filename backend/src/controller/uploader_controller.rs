use crate::model::{
    data,
    data_source::DataSource,
    dataset::{self, Dataset},
    geo_id::GeoId,
    upload_metadata::{Source, UploadMetadata},
};

use super::AppState;
use actix_web::{
    http::{StatusCode, Uri},
    post, web, HttpResponse,
};
use derive_more::Display;
use serde::Serialize;
use std::{
    collections::{HashMap, HashSet},
    fs::File,
};

#[derive(Debug, Display, Serialize)]
#[serde(tag = "name", content = "info")]
enum Error {
    InvalidCsv(String),
    #[display(fmt = "Missing column {column} in row {row} with data {record:#?}")]
    MissingColumn {
        column: String,
        row: usize,
        record: HashMap<String, String>,
    },
    #[display(fmt = "GeoId {geo_id} is not numeric in row {row}")]
    GeoIdNotNumeric {
        geo_id: String,
        row: usize,
    },
    #[display(fmt = "Invalid year {year} in row {row}")]
    InvalidYear {
        year: String,
        row: usize,
    },
    #[display(fmt = "Invalid geo ids: {_0:#?}")]
    InvalidGeoIds(Vec<GeoId>),
    #[display(fmt = "Duplicate data in csv row {}", row)]
    DuplicateDataInCsv {
        row: usize,
        parsed_data: data::Parsed,
    },
    #[display(fmt = "Duplicate datasets: {_0:#?}")]
    DuplicateDatasets(Vec<Dataset>),
    DuplicateDataSource(DataSource),
    DataSourceIncomplete,
    DataSourceLinkInvalid(String),
    MissingMetadata,
    InvalidMetadata(String),
    MissingFile,
    Internal(String),
}

impl std::error::Error for Error {}

impl From<csv::Error> for Error {
    fn from(error: csv::Error) -> Self {
        Error::InvalidCsv(error.to_string())
    }
}

impl From<std::io::Error> for Error {
    fn from(error: std::io::Error) -> Self {
        Error::Internal(error.to_string())
    }
}

impl From<sqlx::Error> for Error {
    fn from(error: sqlx::Error) -> Self {
        Error::Internal(error.to_string())
    }
}

impl actix_web::error::ResponseError for Error {
    fn status_code(&self) -> StatusCode {
        match self {
            Error::Internal(_) => StatusCode::INTERNAL_SERVER_ERROR,
            _ => StatusCode::BAD_REQUEST,
        }
    }

    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code()).json(self)
    }
}

pub fn init_editor(cfg: &mut web::ServiceConfig) {
    cfg.service(upload);
}

fn parse_csv(file: &File, metadata: &UploadMetadata) -> Result<HashSet<data::Parsed>, Error> {
    let mut reader = csv::Reader::from_reader(file);
    let mut new_data: HashSet<data::Parsed> = HashSet::new();
    let mut data_columns: HashSet<String> = metadata.new_datasets.keys().cloned().collect();
    data_columns.extend(
        metadata
            .existing_datasets
            .keys()
            .cloned()
            .collect::<HashSet<String>>(),
    );

    for (i, result) in reader.deserialize().enumerate() {
        let record: HashMap<String, String> = result?;
        let id_str = match record.get(&metadata.id_column) {
            None => {
                return Err(Error::MissingColumn {
                    record,
                    column: metadata.id_column.clone(),
                    row: i,
                })
            }
            Some(id_str) => id_str,
        };
        let id: i32 = id_str.parse::<i32>().map_err(|_| Error::GeoIdNotNumeric {
            geo_id: id_str.to_string(),
            row: i,
        })?;

        let year_str = match record.get(&metadata.date_column) {
            None => {
                return Err(Error::MissingColumn {
                    record,
                    column: metadata.date_column.clone(),
                    row: i,
                })
            }
            Some(year_str) => year_str,
        };

        let year: i32 = year_str
            .parse::<i32>()
            .map_err(|_| Error::GeoIdNotNumeric {
                geo_id: year_str.to_string(),
                row: i,
            })?;
        let start_date: chrono::NaiveDate = chrono::NaiveDate::from_ymd_opt(year, 1, 1)
            .ok_or_else(|| Error::InvalidYear {
                year: year_str.to_string(),
                row: i,
            })?;
        let end_date: chrono::NaiveDate = chrono::NaiveDate::from_ymd_opt(year, 12, 31)
            .ok_or_else(|| Error::InvalidYear {
                year: year_str.to_string(),
                row: i,
            })?;

        for column in &data_columns {
            let value = match record.get(column) {
                None => {
                    return Err(Error::MissingColumn {
                        record,
                        column: column.clone(),
                        row: i,
                    })
                }
                Some(value) => value,
            };
            let value = value.parse::<f64>();
            if let Ok(value) = value {
                // ignore empty values or values that can't parse to float
                // assume those are intentionally empty in the csv (no measured value)
                let parsed_data = data::Parsed {
                    start_date,
                    end_date,
                    dataset: column.clone(),
                    id,
                    value,
                };
                let inserted = new_data.insert(parsed_data);

                if !inserted {
                    return Err(Error::DuplicateDataInCsv {
                        parsed_data: data::Parsed {
                            start_date,
                            end_date,
                            dataset: column.clone(),
                            id,
                            value,
                        },
                        row: i,
                    });
                }
            }
        }
    }
    Ok(new_data)
}

#[post("/upload")]
async fn upload(
    mut parts: awmp::Parts,
    app_state: web::Data<AppState<'_>>,
) -> Result<String, Error> {
    let metadata: UploadMetadata = parts
        .texts
        .as_hash_map()
        .get("metadata")
        .ok_or(Error::MissingMetadata)
        .map(|s| serde_json::from_str(s))?
        .map_err(|e| Error::InvalidMetadata(e.to_string()))?;

    let file = parts
        .files
        .take("file")
        .pop()
        .ok_or(Error::MissingFile)?
        .into_inner()
        .reopen()?;

    let data = parse_csv(&file, &metadata)?;
    let new_datasets: HashMap<_, _> = metadata
        .new_datasets
        .iter()
        .map(|(column, dataset)| {
            (
                column,
                dataset::Creator::from(dataset, metadata.geography_type),
            )
        })
        .collect();

    let duplicate_datasets: Vec<Dataset> = app_state
        .database
        .dataset
        .find_duplicates(&new_datasets.values().collect::<Vec<_>>())
        .await?;

    if !duplicate_datasets.is_empty() {
        return Err(Error::DuplicateDatasets(duplicate_datasets));
    }

    let geo_ids = data
        .iter()
        .map(|row| GeoId {
            id: row.id,
            geography_type: metadata.geography_type,
        })
        .collect();

    let invalid_ids = app_state.database.geo_id.get_invalid_ids(&geo_ids).await?;

    if !invalid_ids.is_empty() {
        return Err(Error::InvalidGeoIds(invalid_ids));
    }

    let mut datasets = HashMap::new();
    for (column, id) in metadata.existing_datasets {
        let dataset = app_state.database.dataset.by_id(id).await?;
        datasets.insert(column, dataset);
    }

    let source_id = match metadata.source {
        Source::ExistingId(id) => id,
        Source::New(ref new_data_source) => {
            new_data_source
                .link
                .parse::<Uri>()
                .map_err(|_| Error::DataSourceLinkInvalid(new_data_source.link.clone()))?;

            if new_data_source.name.is_empty() || new_data_source.description.is_empty() {
                return Err(Error::DataSourceIncomplete);
            }

            if let Some(data_source) = app_state
                .database
                .data_source
                .by_name(&new_data_source.name)
                .await?
            {
                return Err(Error::DuplicateDataSource(data_source));
            }

            app_state
                .database
                .data_source
                .create(new_data_source)
                .await?
        }
    };

    for (column, draft_dataset) in new_datasets {
        datasets.insert(
            column.clone(),
            app_state.database.dataset.create(&draft_dataset).await?,
        );
    }

    let data = data
        .into_iter()
        .map(|data| {
            datasets.get(&data.dataset).map(|dataset| {
                data::Creator::new(&data, dataset.id, source_id, dataset.geography_type)
            })
        })
        .collect::<Option<HashSet<_>>>()
        .ok_or_else(|| Error::Internal("Could not match datasets to data".to_string()))?;

    let result = app_state.database.data.insert(&data).await?;

    Ok(format!("inserted {} rows of data", result.rows_affected()))
}

#[cfg(test)]
mod tests {

    use super::*;
    use crate::model::{data_source, dataset::PartialCreator};
    use assert_matches::assert_matches;
    use chrono::NaiveDate;

    fn metadata() -> UploadMetadata {
        UploadMetadata {
            source: Source::New(data_source::Creator {
                name: "name".to_string(),
                link: "https://example.com".to_string(),
                description: "description".to_string(),
            }),
            new_datasets: HashMap::from([(
                "value1".to_string(),
                PartialCreator {
                    description: "dataset description".to_string(),
                    name: "dataset name".to_string(),
                    units: "units".to_string(),
                },
            )]),
            existing_datasets: HashMap::from([("value2".to_string(), 1)]),
            id_column: "id".to_string(),
            date_column: "date".to_string(),
            geography_type: 1,
        }
    }

    #[test]
    fn it_reports_missing_data_column() {
        let metadata = metadata();
        let file = File::open("src/controller/test_data/missing_data_column.csv").unwrap();
        let result = parse_csv(&file, &metadata);
        assert_matches!(
            result,
            Err(Error::MissingColumn { column, row, record })
            if column == "value2"
            && row == 0
            && record == HashMap::from([
                ("id".to_string(), "1".to_string()),
                ("date".to_string(), "2020".to_string()),
                ("value1".to_string(), "11".to_string())
            ])
        );
    }

    #[test]
    fn it_reports_missing_id_column() {
        let metadata = metadata();
        let file = File::open("src/controller/test_data/missing_id_column.csv").unwrap();
        let result = parse_csv(&file, &metadata);
        assert_matches!(
            result,
            Err(Error::MissingColumn { column, row, record })
            if column == "id"
            && row == 0
            && record == HashMap::from([
                ("date".to_string(), "2020".to_string()),
                ("value1".to_string(), "11".to_string()),
                ("value2".to_string(), "21".to_string())
            ])
        );
    }

    #[test]
    fn it_reports_missing_date_column() {
        let metadata = metadata();
        let file = File::open("src/controller/test_data/missing_date_column.csv").unwrap();
        let result = parse_csv(&file, &metadata);
        assert_matches!(
            result,
            Err(Error::MissingColumn { column, row, record })
            if column == "date"
            && row == 0
            && record == HashMap::from([
                ("id".to_string(), "1".to_string()),
                ("value1".to_string(), "11".to_string()),
                ("value2".to_string(), "21".to_string())
            ])
        );
    }

    #[test]
    fn error_on_wrong_row_length() {
        let metadata = metadata();
        let file = File::open("src/controller/test_data/wrong_row_length.csv").unwrap();
        let result = parse_csv(&file, &metadata);
        assert_matches!(result, Err(Error::InvalidCsv(_)));
    }

    #[test]
    fn test_valid_csv() {
        let metadata = metadata();
        let file = File::open("src/controller/test_data/valid_data.csv").unwrap();
        let received = parse_csv(&file, &metadata).unwrap();
        let expected = HashSet::from([
            data::Parsed {
                dataset: "value1".to_string(),
                start_date: NaiveDate::from_ymd_opt(2020, 1, 1).unwrap(),
                end_date: NaiveDate::from_ymd_opt(2020, 12, 31).unwrap(),
                id: 1,
                value: 11.0,
            },
            data::Parsed {
                dataset: "value1".to_string(),
                start_date: NaiveDate::from_ymd_opt(2020, 1, 1).unwrap(),
                end_date: NaiveDate::from_ymd_opt(2020, 12, 31).unwrap(),
                id: 3,
                value: 13.0,
            },
            data::Parsed {
                dataset: "value2".to_string(),
                start_date: NaiveDate::from_ymd_opt(2020, 1, 1).unwrap(),
                end_date: NaiveDate::from_ymd_opt(2020, 12, 31).unwrap(),
                id: 1,
                value: 21.0,
            },
            data::Parsed {
                dataset: "value2".to_string(),
                start_date: NaiveDate::from_ymd_opt(2020, 1, 1).unwrap(),
                end_date: NaiveDate::from_ymd_opt(2020, 12, 31).unwrap(),
                id: 3,
                value: 23.0,
            },
            data::Parsed {
                dataset: "value2".to_string(),
                start_date: NaiveDate::from_ymd_opt(2022, 1, 1).unwrap(),
                end_date: NaiveDate::from_ymd_opt(2022, 12, 31).unwrap(),
                id: 5,
                value: 25.0,
            },
            data::Parsed {
                dataset: "value1".to_string(),
                start_date: NaiveDate::from_ymd_opt(2022, 1, 1).unwrap(),
                end_date: NaiveDate::from_ymd_opt(2022, 12, 31).unwrap(),
                id: 7,
                value: 17.7,
            },
        ]);
        assert_eq!(
            expected, received,
            "\nexpected: {expected:#?}\nreceived: {received:#?}\n",
        );
    }
}
