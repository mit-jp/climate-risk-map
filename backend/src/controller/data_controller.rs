use super::AppState;
use crate::controller::csv_converter;
use crate::model::data::SourceAndDate;
use actix_web::delete;
use actix_web::{get, web, HttpResponse, Responder};
use chrono::NaiveDate;
use serde::Deserialize;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_by_dataset);
    cfg.service(get_percentiles);
    cfg.service(get_state_percentiles);
    cfg.service(get_by_map_visualization);
}

pub fn init_editor(cfg: &mut web::ServiceConfig) {
    cfg.service(delete);
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
        Ok(data) => match csv_converter::convert(data) {
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
            &SourceAndDate {
                source: info.source,
                start_date: info.start_date,
                end_date: info.end_date,
            },
        )
        .await;
    match result {
        Ok(result) => {
            let csv = csv_converter::convert(result);
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
        Ok(data) => match csv_converter::convert(data) {
            Ok(csv) => HttpResponse::Ok().content_type("text/csv").body(csv),
            Err(_) => HttpResponse::NotFound().finish(),
        },
        Err(_) => HttpResponse::NotFound().finish(),
    }
}

#[get("/state_percentile")]
async fn get_state_percentiles(
    info: web::Query<PercentileInfo>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let data = app_state.database.data.state_percentile(info.into_inner()).await;

    match data {
        Ok(data) => match csv_converter::convert(data) {
            Ok(csv) => HttpResponse::Ok().content_type("text/csv").body(csv),
            Err(_) => HttpResponse::NotFound().finish(),
        },
        Err(_) => HttpResponse::NotFound().finish(),
    }
}

#[delete("/dataset/{dataset}/data")]
async fn delete(app_state: web::Data<AppState<'_>>, dataset: web::Path<i32>) -> impl Responder {
    let result = app_state
        .database
        .data
        .delete_by_dataset(dataset.into_inner())
        .await;

    match result {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::NotFound().finish(),
    }
}
