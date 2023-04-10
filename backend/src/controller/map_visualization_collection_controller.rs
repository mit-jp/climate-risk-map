use actix_web::{delete, post, web, HttpResponse, Responder};
use log::error;

use crate::{
    model::{MapVisualizationCollection, MapVisualizationCollectionId},
    AppState,
};

pub fn init_editor(cfg: &mut web::ServiceConfig) {
    cfg.service(delete);
    cfg.service(create);
}

#[delete("/map-visualization-collection")]
async fn delete(
    app_state: web::Data<AppState<'_>>,
    json: web::Json<MapVisualizationCollectionId>,
) -> impl Responder {
    let result = app_state
        .database
        .map_visualization_collection
        .delete(json.into_inner())
        .await;
    match result {
        Err(e) => {
            error!("Error deleting map visualization collection: {:#?}", e);
            HttpResponse::InternalServerError().finish()
        }
        Ok(_) => HttpResponse::Ok().finish(),
    }
}

#[post("/map-visualization-collection")]
async fn create(
    app_state: web::Data<AppState<'_>>,
    json: web::Json<MapVisualizationCollectionId>,
) -> impl Responder {
    let order = app_state
        .database
        .map_visualization_collection
        .get_last_order(json.category)
        .await;
    let order = match order {
        Err(e) => {
            error!("Error getting last order: {:#?}", e);
            return HttpResponse::InternalServerError().finish();
        }
        Ok(o) => o,
    };
    let result = app_state
        .database
        .map_visualization_collection
        .create(MapVisualizationCollection {
            order: order + 1,
            category: json.category,
            map_visualization: json.map_visualization,
        })
        .await;
    match result {
        Err(e) => {
            error!("Error creating map visualization collection: {:#?}", e);
            HttpResponse::InternalServerError().finish()
        }
        Ok(_) => HttpResponse::Ok().finish(),
    }
}
