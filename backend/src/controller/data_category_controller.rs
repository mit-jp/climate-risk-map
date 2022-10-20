use super::AppState;
use crate::controller::{
    data_controller::data_to_body, map_visualization_controller::IncludeDrafts,
};
use crate::model::DataCategory;
use actix_web::{get, web, HttpResponse, Responder};
use log::error;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
    cfg.service(get_data);
}

#[get("/data-category")]
async fn get_all(
    app_state: web::Data<AppState<'_>>,
    info: web::Query<IncludeDrafts>,
) -> impl Responder {
    let data_categories = app_state.database.data_category.all().await;

    match data_categories {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(mut data_categories) => {
            if info.include_drafts.unwrap_or(false) {
                data_categories.push(DataCategory {
                    id: -1,
                    name: "uncategorized".to_string(),
                });
            }
            HttpResponse::Ok().json(data_categories)
        }
    }
}

#[get("/data-category/{id}/data")]
async fn get_data(app_state: web::Data<AppState<'_>>, id: web::Path<i32>) -> impl Responder {
    let data = app_state
        .database
        .data
        .by_data_category(id.into_inner())
        .await;

    match data_to_body(data) {
        Ok(body) => HttpResponse::Ok().content_type("text/csv").body(body),
        Err(e) => {
            error!("{}", e);
            HttpResponse::NotFound().finish()
        }
    }
}
