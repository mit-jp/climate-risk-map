use actix_web::{get, web, HttpResponse, Responder};

use crate::AppState;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
}

#[get("/geography-type")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    let geography_types = app_state.database.geography_type.all().await;
    match geography_types {
        Ok(geography_types) => HttpResponse::Ok().json(geography_types),
        Err(_) => HttpResponse::NotFound().finish(),
    }
}
