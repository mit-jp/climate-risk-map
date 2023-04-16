use super::AppState;
use crate::model::dataset::Diff;
use actix_web::{delete, get, patch, web, HttpResponse, Responder};
use derive_more::Display;
use log::error;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
    cfg.service(get);
}

pub fn init_editor(cfg: &mut web::ServiceConfig) {
    cfg.service(update);
    cfg.service(delete);
}

#[patch("/dataset")]
async fn update(app_state: web::Data<AppState<'_>>, dataset: web::Json<Diff>) -> impl Responder {
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

#[delete("/dataset/{id}")]
async fn delete(id: web::Path<i32>, app_state: web::Data<AppState<'_>>) -> Result<String, Error> {
    let id = id.into_inner();
    app_state
        .database
        .map_visualization_collection
        .delete_by_dataset(id)
        .await
        .map_err(Error)?;
    app_state
        .database
        .map_visualization
        .delete_by_dataset(id)
        .await
        .map_err(Error)?;
    app_state
        .database
        .data
        .delete_by_dataset(id)
        .await
        .map_err(Error)?;
    app_state.database.dataset.delete(id).await.map_err(Error)?;
    Ok("deleted".to_string())
}

#[derive(Debug, Display)]
struct Error(sqlx::Error);

impl actix_web::error::ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
        error!("{self}");
        HttpResponse::build(self.status_code()).finish()
    }
}
