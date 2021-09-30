use super::AppState;
use actix_web::{get, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
}

#[get("/scale-type")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    println!("GET: /scale-type");

    let scale_types = app_state.database.scale_type.all().await;

    match scale_types {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(scale_types) => HttpResponse::Ok().json(scale_types),
    }
}
