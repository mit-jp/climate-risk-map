use crate::model::data_source::Diff;

use super::AppState;
use actix_web::{delete, get, patch, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
}

pub fn init_editor(cfg: &mut web::ServiceConfig) {
    cfg.service(update);
    cfg.service(delete);
}

#[patch("/data-source")]
async fn update(
    app_state: web::Data<AppState<'_>>,
    data_source: web::Json<Diff>,
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

#[delete("/data-source/{id}")]
async fn delete(id: web::Path<i32>, app_state: web::Data<AppState<'_>>) -> impl Responder {
    let id = id.into_inner();
    let result = app_state.database.data.delete_by_source(id).await;

    match result {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(_) => {
            let result = app_state.database.data_source.delete(id).await;

            match result {
                Err(_) => HttpResponse::NotFound().finish(),
                Ok(_) => HttpResponse::Ok().finish(),
            }
        }
    }
}
