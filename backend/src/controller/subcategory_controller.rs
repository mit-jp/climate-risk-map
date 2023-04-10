use super::AppState;
use actix_web::{get, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
}

#[get("/subcategory")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    let subcategories = app_state.database.subcategory.all().await;

    match subcategories {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(subcategories) => HttpResponse::Ok().json(subcategories),
    }
}
