use crate::model::DatasetDiff;

use super::AppState;
use actix_web::{get, patch, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
    cfg.service(get);
}

pub fn init_editor(cfg: &mut web::ServiceConfig) {
    cfg.service(update);
}

#[patch("/dataset")]
async fn update(
    app_state: web::Data<AppState<'_>>,
    dataset: web::Json<DatasetDiff>,
) -> impl Responder {
    let result = app_state.database.dataset.update(&dataset).await;

    match result {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(_) => HttpResponse::Ok().finish(),
    }
}

#[get("/dataset/{id}")]
async fn get(id: web::Path<i32>, app_state: web::Data<AppState<'_>>) -> impl Responder {
    let datasets = app_state.database.dataset.by_id(id.into_inner()).await;

    match datasets {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(datasets) => HttpResponse::Ok().json(datasets),
    }
}

#[get("/dataset")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    let datasets = app_state.database.dataset.all().await;

    match datasets {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(datasets) => HttpResponse::Ok().json(datasets),
    }
}
