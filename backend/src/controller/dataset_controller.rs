use super::AppState;
use actix_web::{get, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
    cfg.service(get);
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
