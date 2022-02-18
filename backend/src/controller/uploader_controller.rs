use std::collections::{HashMap, HashSet};

use super::AppState;
use crate::model::{NewData, Source, UploadMetadata};
use actix_web::{error, post, web, Error, HttpResponse};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(upload);
}

#[post("/upload")]
async fn upload(
    mut parts: awmp::Parts,
    app_state: web::Data<AppState<'_>>,
) -> Result<HttpResponse, Error> {
    log::info!("hello");
    let metadata: UploadMetadata = parts
        .texts
        .as_hash_map()
        .get("metadata")
        .ok_or_else(|| error::ErrorBadRequest("Missing metadata"))
        .map(|s| serde_json::from_str(s))?
        .map_err(|e| error::ErrorBadRequest(format!("Metadata was invalid: {}", e)))?;

    let file = parts
        .files
        .take("file")
        .pop()
        .ok_or_else(|| error::ErrorBadRequest("No file provided"))?
        .into_inner()
        .reopen()?;

    let source_id = match metadata.source {
        Source::ExistingId(id) => id,
        Source::New(ref new_data_source) => app_state
            .database
            .data_source
            .create(new_data_source)
            .await
            .map_err(error::ErrorBadRequest)?,
    };
    log::info!("inserted source");

    let mut column_to_dataset_id: HashMap<&String, i32> = HashMap::new();

    for dataset in &metadata.datasets {
        let dataset_id = app_state
            .database
            .dataset
            .create(dataset)
            .await
            .map_err(error::ErrorBadRequest)?;
        log::info!("inserted dataset");
        for column in &dataset.columns {
            column_to_dataset_id.insert(&column.name, dataset_id);
        }
    }
    log::info!("inserted all datasets");

    let mut new_data: HashSet<NewData> = HashSet::new();
    let mut reader = csv::Reader::from_reader(file);
    for result in reader.deserialize() {
        let record: HashMap<String, String> =
            result.map_err(|error| error::ErrorBadRequest(format!("Invalid CSV: {}", error)))?;
        let county_id = record
            .get(&metadata.county_id_column)
            .map(|s| s.parse::<i16>())
            .ok_or_else(|| {
                error::ErrorBadRequest(format!(
                    "Missing county id ({}) in this row: {record:?}",
                    metadata.county_id_column
                ))
            })?
            .map_err(|error| {
                error::ErrorBadRequest(format!("County id isn't an integer: {}", error))
            })?;
        let state_id = record
            .get(&metadata.state_id_column)
            .map(|s| s.parse::<i16>())
            .ok_or_else(|| {
                error::ErrorBadRequest(format!(
                    "Missing state id ({}) in this row: {:?}",
                    metadata.state_id_column, record
                ))
            })?
            .map_err(|error| {
                error::ErrorBadRequest(format!("State id isn't an integer: {}", error))
            })?;

        for dataset in &metadata.datasets {
            for column in &dataset.columns {
                let value = record
                    .get(&column.name)
                    .map(|s| s.parse::<f64>())
                    .ok_or_else(|| {
                        error::ErrorBadRequest(format!(
                            "Missing column ({}) in this row: {:?}",
                            column.name, record
                        ))
                    })?
                    .ok();

                let dataset_id = column_to_dataset_id[&column.name];
                let inserted = new_data.insert(NewData {
                    dataset: dataset_id,
                    source: source_id,
                    start_date: column.start_date,
                    end_date: column.end_date,
                    county_id,
                    state_id,
                    value,
                });

                if !inserted {
                    return Err(error::ErrorBadRequest(format!(
                        "Duplicate data: {:?}",
                        NewData {
                            dataset: dataset_id,
                            source: source_id,
                            start_date: column.start_date,
                            end_date: column.end_date,
                            county_id,
                            state_id,
                            value,
                        }
                    )));
                }
            }
        }
    }

    let result = app_state
        .database
        .data
        .insert(&new_data)
        .await
        .map_err(|e| error::ErrorBadRequest(format!("Error inserting data: {}", e)))?;

    log::info!("inserted {} rows of data", result.rows_affected());
    Ok(HttpResponse::Ok().body("Uploaded"))
}
