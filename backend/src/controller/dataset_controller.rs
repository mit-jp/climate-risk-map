use super::AppState;
use actix_web::{get, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
    cfg.service(get);
    cfg.service(get_map_visualization);
}

#[get("/dataset/{id}")]
async fn get(id: web::Path<i32>, app_state: web::Data<AppState<'_>>) -> impl Responder {
    println!("GET: /dataset/{}", id);

    let counties = app_state.database.dataset.by_id(id.into_inner()).await;

    match counties {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(counties) => HttpResponse::Ok().json(counties),
    }
}

#[get("/dataset")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    println!("GET: /dataset");

    let counties = app_state.database.dataset.all().await;

    match counties {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(counties) => HttpResponse::Ok().json(counties),
    }
}

#[get("/dataset/{id}/map-visualization")]
async fn get_map_visualization(
    id: web::Path<i32>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    println!("GET: /dataset/{}/map-visualization", id);

    let map_visualization = app_state
        .database
        .map_visualization
        .by_dataset(id.into_inner())
        .await;

    match map_visualization {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(map_visualization) => HttpResponse::Ok().json(map_visualization),
    }
}
