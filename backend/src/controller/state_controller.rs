use super::AppState;
use actix_web::{get, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
    cfg.service(get);
}

#[get("/state/{id}")]
async fn get(id: web::Path<i16>, app_state: web::Data<AppState<'_>>) -> impl Responder {
    println!("GET: /state/{}", id);

    let state = app_state.database.state.by_id(id.into_inner()).await;

    match state {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(state) => HttpResponse::Ok().json(state),
    }
}

#[get("/state")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    println!("GET: /state");

    let states = app_state.database.state.all().await;

    match states {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(states) => HttpResponse::Ok().json(states),
    }
}
