use super::AppState;
use actix_web::{get, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
}

#[get("/color-palette")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    println!("GET: /color-palette");

    let color_palettes = app_state.database.color_palette.all().await;

    match color_palettes {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(color_palettes) => HttpResponse::Ok().json(color_palettes),
    }
}
