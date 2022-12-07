use super::AppState;
use super::SourceAndDate;
use actix_web::{get, web, HttpResponse, Responder};
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use std::error::Error;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get);
    cfg.service(get_county_percentiles);
}

pub fn data_to_csv<S: Serialize>(data: Vec<S>) -> Result<String, Box<dyn Error>> {
    let mut writer = csv::Writer::from_writer(vec![]);
    for d in data {
        writer.serialize(d)?;
    }
    let serialized_data = writer.into_inner()?;
    Ok(String::from_utf8(serialized_data)?)
}

#[derive(Deserialize)]
struct Info {
    source: i32,
    start_date: NaiveDate,
    end_date: NaiveDate,
}

#[derive(Deserialize)]
pub struct DataQuery {
    pub category: i32,
    pub state_id: i16,
    pub county_id: i16,
}

#[get("/data/{id}")]
async fn get(
    id: web::Path<i32>,
    info: web::Query<Info>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let data = app_state
        .database
        .data
        .by_id_source_date(
            id.into_inner(),
            SourceAndDate {
                source: info.source,
                start_date: info.start_date,
                end_date: info.end_date,
            },
        )
        .await;

    match data {
        Ok(data) => {
            let csv = data_to_csv(data);
            match csv {
                Ok(csv) => HttpResponse::Ok().content_type("text/csv").body(csv),
                Err(_) => HttpResponse::NotFound().finish(),
            }
        }
        Err(_) => HttpResponse::NotFound().finish(),
    }
}

#[get("/data")]
async fn get_county_percentiles(
    info: web::Query<DataQuery>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let data = app_state
        .database
        .data
        .by_category_state_county(info.into_inner())
        .await;

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
    fn test_data_to_csv() {
        let data = vec![
            SimpleData {
                value: Some(1.1),
                county_id: 1,
                state_id: 10,
            },
            SimpleData {
                county_id: 3,
                state_id: 20,
                value: None,
            },
            SimpleData {
                county_id: 2,
                state_id: 20,
                value: Some(2.2),
            },
        ];
        let csv = data_to_csv(data).unwrap();
        assert_eq!(csv, "county_id,state_id,value\n1,10,1.1\n3,20,\n2,20,2.2\n");
    }
}
