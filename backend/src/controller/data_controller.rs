use super::AppState;
use super::SourceAndDate;
use actix_web::{get, web, HttpResponse, Responder};
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use std::error::Error;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_by_country);
    cfg.service(get_by_usa_county);
    cfg.service(get_county_percentiles);
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
pub struct DataQuery {
    pub category: i32,
    pub state_id: i16,
    pub county_id: i16,
}

#[get("/map-visualization/{id}/data")]
async fn get_by_map_visualization(
    id: web::Path<i32>,
    info: web::Query<Info>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let result = app_state
        .database
        .usa_county_data
        .by_map_visualization(
            id.into_inner(),
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

#[get("/usa-county-data/{id}")]
async fn get_by_usa_county(
    id: web::Path<i32>,
    info: web::Query<Info>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let data = app_state
        .database
        .usa_county_data
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

#[get("/usa-county-data")]
async fn get_county_percentiles(
    info: web::Query<DataQuery>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let data = app_state
        .database
        .usa_county_data
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

#[get("/country-data/{id}")]
async fn get_by_country(
    id: web::Path<i32>,
    info: web::Query<Info>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let data = app_state
        .database
        .country_data
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
    use crate::model::{CountrySimpleData, USACountySimpleData};

    #[test]
    fn it_converts_usa_county_data_to_csv() {
        let data = vec![
            USACountySimpleData {
                county_id: 1,
                state_id: 2,
                value: Some(3.0),
            },
            USACountySimpleData {
                county_id: 4,
                state_id: 5,
                value: Some(6.0),
            },
        ];
        let csv = data_to_csv(data).unwrap();
        assert_eq!(csv, "county_id,state_id,value\n1,2,3.0\n4,5,6.0\n");
    }

    #[test]
    fn it_converts_country_data_to_csv() {
        let data = vec![
            CountrySimpleData {
                country_id: 123,
                value: Some(3.0),
            },
            CountrySimpleData {
                country_id: 456,
                value: Some(6.0),
            },
        ];
        let csv = data_to_csv(data).unwrap();
        assert_eq!(csv, "country_id,value\n1,3.0\n3,6.0\n");
    }
}
