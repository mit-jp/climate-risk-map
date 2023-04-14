use super::AppState;
use crate::model::{
    DataSource, Dataset, FullData, GeoId, NewData, ParsedData, Source, UploadMetadata,
};
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
    #[display(fmt = "Invalid geo ids: {_0:#?}")]
    InvalidGeoIds(Vec<GeoId>),
    #[display(fmt = "Duplicate data in csv row {}", row)]
    DuplicateDataInCsv {
        row: usize,
        parsed_data: ParsedData,
    },
    #[display(fmt = "Duplicate data in db: {_0:#?}")]
    DuplicateDataInDb(FullData),
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

fn parse_csv(file: &File, metadata: &UploadMetadata) -> Result<HashSet<ParsedData>, Error> {
    let mut new_data: HashSet<ParsedData> = HashSet::new();
    let mut reader = csv::Reader::from_reader(file);
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

        for dataset in &metadata.datasets {
            for column in &dataset.columns {
                let value = match record.get(&column.name) {
                    None => {
                        return Err(Error::MissingColumn {
                            record,
                            column: column.name.clone(),
                            row: i,
                        })
                    }
                    Some(value) => value,
                };
                let value = value.parse::<f64>().ok();
                let parsed_data = ParsedData {
                    dataset: column.name.clone(),
                    start_date: column.start_date,
                    end_date: column.end_date,
                    id,
                    value,
                };
                let inserted = new_data.insert(parsed_data);

                if !inserted {
                    return Err(Error::DuplicateDataInCsv {
                        parsed_data: ParsedData {
                            dataset: column.name.clone(),
                            start_date: column.start_date,
                            end_date: column.end_date,
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

struct Metadata {
    dataset: i32,
    geography_type: i32,
}

#[post("/upload")]
async fn upload(mut parts: awmp::Parts, app_state: web::Data<AppState<'_>>) -> Result<&str, Error> {
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
    log::info!("inserted source");

    let mut column_to_metadata: HashMap<String, Metadata> = HashMap::new();

    let duplicate_datasets = app_state
        .database
        .dataset
        .duplicates(&metadata.datasets)
        .await?;

    if !duplicate_datasets.is_empty() {
        return Err(Error::DuplicateDatasets(duplicate_datasets));
    }

    for draft_dataset in &metadata.datasets {
        let created_dataset = app_state.database.dataset.create(draft_dataset).await?;
        log::info!("inserted dataset");
        for column in &draft_dataset.columns {
            column_to_metadata.insert(
                column.name.clone(),
                Metadata {
                    dataset: created_dataset.id,
                    geography_type: created_dataset.geography_type,
                },
            );
        }
    }
    log::info!("inserted all datasets");

    let data = data
        .into_iter()
        .map(|data| {
            column_to_metadata.get(&data.dataset).map(|metadata| {
                NewData::new(&data, metadata.dataset, source_id, metadata.geography_type)
            })
        })
        .collect::<Option<HashSet<_>>>()
        .ok_or_else(|| Error::Internal("Could not match datasets to data".to_string()))?;

    let geo_ids = data
        .iter()
        .map(|d| GeoId {
            id: d.id,
            geography_type: d.geography_type,
        })
        .collect();

    let invalid_ids = app_state.database.geo_id.get_invalid_ids(&geo_ids).await?;

    if !invalid_ids.is_empty() {
        return Err(Error::InvalidGeoIds(invalid_ids));
    }

    let duplicate_data = app_state.database.data.first_duplicate(&data).await?;

    if let Some(duplicate_data) = duplicate_data {
        return Err(Error::DuplicateDataInDb(duplicate_data));
    }

    let result = app_state.database.data.insert(&data).await?;

    log::info!("inserted {} rows of data", result.rows_affected());
    Ok("Uploaded")
}

#[cfg(test)]
mod tests {

    use super::*;
    use crate::model::{Column, NewDataSource, NewDataset};
    use assert_matches::assert_matches;
    use chrono::NaiveDate;

    fn metadata() -> UploadMetadata {
        UploadMetadata {
            source: Source::New(NewDataSource {
                name: "name".to_string(),
                link: "https://example.com".to_string(),
                description: "description".to_string(),
            }),
            datasets: vec![NewDataset {
                columns: vec![
                    Column {
                        name: "value1".to_string(),
                        start_date: NaiveDate::from_ymd_opt(2020, 1, 1).unwrap(),
                        end_date: NaiveDate::from_ymd_opt(2020, 1, 1).unwrap(),
                    },
                    Column {
                        name: "value2".to_string(),
                        start_date: NaiveDate::from_ymd_opt(2021, 1, 1).unwrap(),
                        end_date: NaiveDate::from_ymd_opt(2021, 1, 1).unwrap(),
                    },
                ],
                geography_type: 1,
                description: "dataset description".to_string(),
                name: "dataset name".to_string(),
                short_name: "dataset short name".to_string(),
                units: "units".to_string(),
            }],
            id_column: "id".to_string(),
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
        let result = parse_csv(&file, &metadata);
        assert_eq!(
            result.unwrap(),
            HashSet::from([
                ParsedData {
                    dataset: "value1".to_string(),
                    start_date: NaiveDate::from_ymd_opt(2020, 1, 1).unwrap(),
                    end_date: NaiveDate::from_ymd_opt(2020, 1, 1).unwrap(),
                    id: 1,
                    value: Some(11.0),
                },
                ParsedData {
                    dataset: "value1".to_string(),
                    start_date: NaiveDate::from_ymd_opt(2020, 1, 1).unwrap(),
                    end_date: NaiveDate::from_ymd_opt(2020, 1, 1).unwrap(),
                    id: 3,
                    value: Some(13.0),
                },
                ParsedData {
                    dataset: "value1".to_string(),
                    start_date: NaiveDate::from_ymd_opt(2020, 1, 1).unwrap(),
                    end_date: NaiveDate::from_ymd_opt(2020, 1, 1).unwrap(),
                    id: 5,
                    value: None,
                },
                ParsedData {
                    dataset: "value2".to_string(),
                    start_date: NaiveDate::from_ymd_opt(2021, 1, 1).unwrap(),
                    end_date: NaiveDate::from_ymd_opt(2021, 1, 1).unwrap(),
                    id: 1,
                    value: Some(21.0),
                },
                ParsedData {
                    dataset: "value2".to_string(),
                    start_date: NaiveDate::from_ymd_opt(2021, 1, 1).unwrap(),
                    end_date: NaiveDate::from_ymd_opt(2021, 1, 1).unwrap(),
                    id: 3,
                    value: Some(23.0),
                },
                ParsedData {
                    dataset: "value2".to_string(),
                    start_date: NaiveDate::from_ymd_opt(2021, 1, 1).unwrap(),
                    end_date: NaiveDate::from_ymd_opt(2021, 1, 1).unwrap(),
                    id: 5,
                    value: None,
                },
            ])
        );
    }
}
