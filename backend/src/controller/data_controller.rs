use super::AppState;
use super::SourceAndDate;
use actix_web::{get, web, HttpResponse, Responder};
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use std::error::Error;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_by_dataset);
    cfg.service(get_percentiles);
    cfg.service(get_by_map_visualization);
}

pub fn data_to_csv<S: Serialize>(data: Vec<S>) -> Result<String, Box<dyn Error>> {
    let mut writer = csv::Writer::from_writer(vec![]);
    for d in data {
        writer.serialize(d)?;
    }
    let serialized_data = writer.into_inner()?;
    Ok(String::from_utf8(serialized_data)?)
}

#[derive(Deserialize, Debug)]
struct Info {
    source: i32,
    start_date: NaiveDate,
    end_date: NaiveDate,
}

#[derive(Deserialize)]
pub struct PercentileInfo {
    pub category: i32,
    pub geo_id: i32,
    pub geography_type: i32,
}

#[get("/data/{dataset}")]
async fn get_by_dataset(
    dataset: web::Path<i32>,
    info: web::Query<Info>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let data = app_state
        .database
        .data
        .by_dataset(
            dataset.into_inner(),
            &SourceAndDate {
                source: info.source,
                start_date: info.start_date,
                end_date: info.end_date,
            },
        )
        .await;

    match data {
        Ok(data) => match data_to_csv(data) {
            Ok(csv) => HttpResponse::Ok().content_type("text/csv").body(csv),
            Err(_) => HttpResponse::NotFound().finish(),
        },
        Err(_) => HttpResponse::NotFound().finish(),
    }
}

#[get("/map-visualization/{map_visualization}/data")]
async fn get_by_map_visualization(
    map_visualization: web::Path<i32>,
    info: web::Query<Info>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let result = app_state
        .database
        .data
        .by_map_visualization(
            map_visualization.into_inner(),
            SourceAndDate {
                source: info.source,
                start_date: info.start_date,
                end_date: info.end_date,
            },
        )
        .await;
    match result {
        Ok(result) => {
            let csv = data_to_csv(result);
            match csv {
                Ok(csv) => HttpResponse::Ok().content_type("text/csv").body(csv),
                Err(_) => HttpResponse::NotFound().finish(),
            }
        }
        Err(_) => HttpResponse::NotFound().finish(),
    }
}

#[get("/percentile")]
async fn get_percentiles(
    info: web::Query<PercentileInfo>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let data = app_state.database.data.percentile(info.into_inner()).await;

    match data {
        Ok(data) => match data_to_csv(data) {
            Ok(csv) => HttpResponse::Ok().content_type("text/csv").body(csv),
            Err(_) => HttpResponse::NotFound().finish(),
        },
        Err(_) => HttpResponse::NotFound().finish(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::SimpleData;

    #[test]
    fn it_converts_data_to_csv() {
        let data = vec![
            SimpleData {
                id: 123,
                value: 3.0,
            },
            SimpleData {
                id: 456,
                value: 6.0,
            },
        ];
        let csv = data_to_csv(data).unwrap();
        assert_eq!(csv, "id,value\n123,3.0\n456,6.0\n");
    }
}
