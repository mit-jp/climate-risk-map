use crate::model::DataSourceDiff;

use super::AppState;
use actix_web::{get, patch, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
}

pub fn init_editor(cfg: &mut web::ServiceConfig) {
    cfg.service(update);
}

#[patch("/data-source")]
async fn update(
    app_state: web::Data<AppState<'_>>,
    data_source: web::Json<DataSourceDiff>,
) -> impl Responder {
    let result = app_state.database.data_source.update(&data_source).await;

    match result {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(_) => HttpResponse::Ok().finish(),
    }
}

#[get("/data-source")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    let data_sources = app_state.database.data_source.all().await;

    match data_sources {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(data_sources) => HttpResponse::Ok().json(data_sources),
    }
}
