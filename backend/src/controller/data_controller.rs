use super::AppState;
use super::SourceAndDate;
use actix_web::{get, web, HttpResponse, Responder};
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use std::io::{Error, ErrorKind};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get);
    cfg.service(get_county_percentiles);
}

pub fn data_to_body<S: Serialize>(data: Result<Vec<S>, sqlx::Error>) -> Result<String, Error> {
    let mut writer = csv::Writer::from_writer(vec![]);
    data.ok()
        .and_then(|data| {
            for row in data {
                if writer.serialize(row).is_err() {
                    return None;
                }
            }
            writer.into_inner().ok()
        })
        .and_then(|data| String::from_utf8(data).ok())
        .ok_or_else(|| Error::new(ErrorKind::Other, "Something went wrong"))
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

    match data_to_body(data) {
        Ok(body) => HttpResponse::Ok().content_type("text/csv").body(body),
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

    match data_to_body(data) {
        Ok(body) => HttpResponse::Ok().content_type("text/csv").body(body),
        Err(_) => HttpResponse::NotFound().finish(),
    }
}
