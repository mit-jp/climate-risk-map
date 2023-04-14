use std::collections::HashMap;

use crate::model::County;

use super::AppState;
use actix_web::{get, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
}

#[get("/county")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    let counties = app_state.database.county.all().await;

    match counties {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(counties) => HttpResponse::Ok().json(
            counties
                .into_iter()
                .map(|county| (county.id, county))
                .collect::<HashMap<i32, County>>(),
        ),
    }
}
