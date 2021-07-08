use super::AppState;
use actix_web::{get, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
    cfg.service(get);
}

#[get("/map-visualization")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    println!("GET: /map-visualization/");

    let map_visualizations = app_state.database.map_visualization.all().await;
    match map_visualizations {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(map_visualizations) => HttpResponse::Ok().json(map_visualizations),
    }
}

#[get("/map-visualization/{id}")]
async fn get(id: web::Path<i32>, app_state: web::Data<AppState<'_>>) -> impl Responder {
    println!("GET: /map-visualization/{}", id);

    let counties = app_state
        .database
        .map_visualization
        .by_dataset(id.into_inner())
        .await;

    match counties {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(counties) => HttpResponse::Ok().json(counties),
    }
}
