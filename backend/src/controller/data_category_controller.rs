use super::AppState;
use crate::{
    controller::map_visualization_controller::MapVisualizationOptions,
    model::data_category::{DataCategory, New},
};
use actix_web::{delete, get, patch, post, web, HttpResponse, Responder};
use log::error;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
}

pub fn init_editor(cfg: &mut web::ServiceConfig) {
    cfg.service(create);
    cfg.service(delete);
    cfg.service(update);
}

#[get("/data-category")]
async fn get_all(
    app_state: web::Data<AppState<'_>>,
    info: web::Query<MapVisualizationOptions>,
) -> impl Responder {
    let data_categories = app_state.database.data_category.all().await;

    match data_categories {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(mut data_categories) => {
            if info.include_drafts.unwrap_or(false) {
                data_categories.push(DataCategory {
                    id: -1,
                    name: "drafts".to_string(),
                    normalized: false,
                    order: 0,
                });
            }
            HttpResponse::Ok().json(data_categories)
        }
    }
}

#[post("/data-category")]
async fn create(
    app_state: web::Data<AppState<'_>>,
    new_data_category: web::Json<New>,
) -> impl Responder {
    let last_order = app_state.database.data_category.last_order().await;

    let data_category = DataCategory {
        order: last_order.unwrap_or(0) + 1,
        id: 0,
        name: new_data_category.name.clone(),
        normalized: new_data_category.normalized,
    };

    let result = app_state
        .database
        .data_category
        .create(&data_category)
        .await;

    match result {
        Err(e) => {
            error!("Error creating data category: {}", e);
            HttpResponse::InternalServerError().finish()
        }
        Ok(result) => HttpResponse::Ok().json(result),
    }
}

#[delete("/data-category/{id}")]
async fn delete(app_state: web::Data<AppState<'_>>, id: web::Path<i32>) -> impl Responder {
    let result = app_state
        .database
        .data_category
        .delete(id.into_inner())
        .await;

    match result {
        Err(e) => {
            error!("Error deleting data category: {}", e);
            HttpResponse::InternalServerError().finish()
        }
        Ok(_) => HttpResponse::Ok().finish(),
    }
}

#[patch("/data-category")]
async fn update(
    app_state: web::Data<AppState<'_>>,
    json: web::Json<DataCategory>,
) -> impl Responder {
    let result = app_state.database.data_category.update(&json).await;

    match result {
        Err(_) => HttpResponse::InternalServerError().finish(),
        Ok(_) => HttpResponse::Ok().finish(),
    }
}
