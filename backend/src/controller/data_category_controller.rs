use super::AppState;
use crate::{
    controller::map_visualization_controller::MapVisualizationOptions,
    model::data_category::{Creator, DataCategory},
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
    new_data_category: web::Json<Creator>,
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

#[cfg(test)]
mod tests {
    use super::*;
    use crate::dao::Database;
    use actix_web::{test, App};
    use sqlx::PgPool;
    use std::sync::{Arc, Mutex};

    #[sqlx::test]
    async fn delete_removes_tab_and_unpublishes_its_maps(pool: PgPool) {
        let tab_id: i32 = sqlx::query_scalar(
            "INSERT INTO data_category (name, normalized, \"order\") VALUES ('cascade tab test', false, 99) RETURNING id",
        )
        .fetch_one(&pool)
        .await
        .unwrap();
        let dataset_id: i32 = sqlx::query_scalar(
            "INSERT INTO dataset (short_name, name, description, units, geography_type) VALUES ('tab_cascade_test', 'Tab Cascade Test', 't', 't', 1) RETURNING id",
        )
        .fetch_one(&pool)
        .await
        .unwrap();
        let map_visualization_id: i32 = sqlx::query_scalar(
            "INSERT INTO map_visualization (dataset, map_type, color_palette, scale_type, formatter_type) VALUES ($1, 1, 1, 2, 3) RETURNING id",
        )
        .bind(dataset_id)
        .fetch_one(&pool)
        .await
        .unwrap();
        sqlx::query(
            "INSERT INTO map_visualization_collection (map_visualization, category, \"order\") VALUES ($1, $2, 0)",
        )
        .bind(map_visualization_id)
        .bind(tab_id)
        .execute(&pool)
        .await
        .unwrap();

        let app_state = web::Data::new(AppState {
            connections: Mutex::new(0),
            database: Arc::new(Database::from_pool(pool.clone())),
        });
        let app = test::init_service(App::new().app_data(app_state).configure(init_editor)).await;
        let request = test::TestRequest::delete()
            .uri(&format!("/data-category/{}", tab_id))
            .to_request();
        let response = test::call_service(&app, request).await;
        assert!(response.status().is_success());

        let tabs: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM data_category WHERE id = $1")
            .bind(tab_id)
            .fetch_one(&pool)
            .await
            .unwrap();
        assert_eq!(tabs, 0);
        let collection_rows: i64 =
            sqlx::query_scalar("SELECT COUNT(*) FROM map_visualization_collection WHERE category = $1")
                .bind(tab_id)
                .fetch_one(&pool)
                .await
                .unwrap();
        assert_eq!(collection_rows, 0);
        let map_visualizations: i64 =
            sqlx::query_scalar("SELECT COUNT(*) FROM map_visualization WHERE id = $1")
                .bind(map_visualization_id)
                .fetch_one(&pool)
                .await
                .unwrap();
        assert_eq!(map_visualizations, 1);
    }
}
