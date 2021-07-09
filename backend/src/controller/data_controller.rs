use super::AppState;
use super::Data;
use actix_web::{get, web, HttpResponse, Responder};
use std::io::{Error, ErrorKind};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get);
}

fn data_to_body(data: Result<Vec<Data>, sqlx::Error>) -> Result<String, Error> {
    let mut writer = csv::Writer::from_writer(vec![]);
    data.ok()
        .and_then(|data| {
            for row in data {
                if writer.serialize(row).is_err() {
                    return None;
                }
            }
            writer.into_inner().ok()
        })
        .and_then(|data| String::from_utf8(data).ok())
        .ok_or_else(|| Error::new(ErrorKind::Other, "Something went wrong"))
}

#[get("/data/{id}")]
async fn get(id: web::Path<i32>, app_state: web::Data<AppState<'_>>) -> impl Responder {
    println!("GET: /data/{}", id);

    let data = app_state.database.data.by_id(id.into_inner()).await;

    match data_to_body(data) {
        Ok(body) => HttpResponse::Ok().content_type("text/csv").body(body),
        Err(_) => HttpResponse::NotFound().finish(),
    }
}
