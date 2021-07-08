use super::AppState;
use actix_web::{get, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get);
}

#[get("/data/{id}")]
async fn get(id: web::Path<i32>, app_state: web::Data<AppState<'_>>) -> impl Responder {
    println!("GET: /data/{}", id);

    let data = app_state.database.data.by_id(id.into_inner()).await;

    match data {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(data) => HttpResponse::Ok().json(data),
    }
}
