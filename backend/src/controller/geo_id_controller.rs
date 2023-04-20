use super::AppState;
use crate::controller::csv_converter;
use actix_web::{get, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
}

#[get("/geo-id.csv")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    let geo_ids = app_state.database.geo_id.all().await;

    match geo_ids {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(geo_ids) => {
            let csv = csv_converter::convert(geo_ids);
            match csv {
                Err(_) => HttpResponse::NotFound().finish(),
                Ok(csv) => HttpResponse::Ok().content_type("text/csv").body(csv),
            }
        }
    }
}
