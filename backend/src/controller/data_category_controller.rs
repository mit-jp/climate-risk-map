use super::AppState;
use crate::controller::map_visualization_controller::IncludeDrafts;
use crate::model::DataCategory;
use actix_web::{get, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
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
