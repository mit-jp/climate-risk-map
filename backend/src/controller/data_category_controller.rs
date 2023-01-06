use std::collections::HashMap;

use super::AppState;
use crate::controller::map_visualization_controller::MapVisualizationOptions;
use crate::model::DataCategory;
use actix_web::{get, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
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
                    name: "uncategorized".to_string(),
                    normalized: false,
                });
            }
            let data_categories_by_id: HashMap<i32, DataCategory> = data_categories
                .into_iter()
                .map(|data_category| (data_category.id, data_category))
                .collect();
            HttpResponse::Ok().json(data_categories_by_id)
        }
    }
}
