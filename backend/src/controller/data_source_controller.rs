use crate::model::data_source::Diff;

use super::AppState;
use actix_web::{delete, get, patch, web, HttpResponse, Responder};
use derive_more::Display;
use log::error;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
}

pub fn init_editor(cfg: &mut web::ServiceConfig) {
    cfg.service(update);
    cfg.service(delete);
}

#[patch("/data-source")]
async fn update(
    app_state: web::Data<AppState<'_>>,
    data_source: web::Json<Diff>,
) -> impl Responder {
    let result = app_state.database.data_source.update(&data_source).await;

    match result {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(_) => HttpResponse::Ok().finish(),
    }
}

#[get("/data-source")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    let data_sources = app_state.database.data_source.all().await;

    match data_sources {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(data_sources) => HttpResponse::Ok().json(data_sources),
    }
}

#[delete("/data-source/{id}")]
async fn delete(id: web::Path<i32>, app_state: web::Data<AppState<'_>>) -> Result<String, Error> {
    let id = id.into_inner();
    let mut transaction = app_state
        .database
        .data_source
        .pool
        .begin()
        .await
        .map_err(Error)?;
    sqlx::query!(
        "UPDATE map_visualization SET default_source = NULL WHERE default_source = $1",
        id
    )
    .execute(&mut transaction)
    .await
    .map_err(Error)?;
    sqlx::query!("DELETE FROM data WHERE source = $1", id)
        .execute(&mut transaction)
        .await
        .map_err(Error)?;
    sqlx::query!("DELETE FROM data_source WHERE id = $1", id)
        .execute(&mut transaction)
        .await
        .map_err(Error)?;
    transaction.commit().await.map_err(Error)?;
    Ok("deleted".to_string())
}

#[derive(Debug, Display)]
struct Error(sqlx::Error);

impl actix_web::error::ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
        error!("{self}");
        HttpResponse::build(self.status_code()).finish()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::dao::Database;
    use crate::AppState;
    use actix_web::{test, App};
    use sqlx::{PgPool, Row};
    use std::sync::{Arc, Mutex};

    #[sqlx::test]
    async fn delete_clears_default_source_and_cascades(pool: PgPool) {
        let source_id: i32 = sqlx::query(
            "INSERT INTO data_source (name, description, link)
             VALUES ('src cascade test', 'test source', 'https://example.com')
             RETURNING id",
        )
        .fetch_one(&pool)
        .await
        .unwrap()
        .get("id");

        let dataset_id: i32 = sqlx::query(
            "INSERT INTO dataset (short_name, name, description, units, geography_type)
             VALUES ('src_cascade_test', 'Src Cascade Test', 't', 't', 1)
             RETURNING id",
        )
        .fetch_one(&pool)
        .await
        .unwrap()
        .get("id");

        let map_visualization_id: i32 = sqlx::query(
            "INSERT INTO map_visualization
                 (dataset, map_type, color_palette, scale_type, formatter_type, default_source)
             VALUES ($1, 1, 1, 2, 3, $2)
             RETURNING id",
        )
        .bind(dataset_id)
        .bind(source_id)
        .fetch_one(&pool)
        .await
        .unwrap()
        .get("id");

        sqlx::query(
            "INSERT INTO data (dataset, source, start_date, end_date, value, geography_type, id)
             SELECT $1, $2, '2020-01-01', '2020-12-31', 1.0, geography_type, id
             FROM geo_id LIMIT 1",
        )
        .bind(dataset_id)
        .bind(source_id)
        .execute(&pool)
        .await
        .unwrap();

        let app_state = web::Data::new(AppState {
            connections: Mutex::new(0),
            database: Arc::new(Database::from_pool(pool.clone())),
        });
        let app = test::init_service(App::new().app_data(app_state).configure(init_editor)).await;

        let request = test::TestRequest::delete()
            .uri(&format!("/data-source/{source_id}"))
            .to_request();
        let response = test::call_service(&app, request).await;
        assert!(
            response.status().is_success(),
            "expected success, got {}",
            response.status()
        );

        let sources: i64 = sqlx::query("SELECT COUNT(*) AS count FROM data_source WHERE id = $1")
            .bind(source_id)
            .fetch_one(&pool)
            .await
            .unwrap()
            .get("count");
        assert_eq!(sources, 0, "data_source row should be deleted");

        let data_rows: i64 = sqlx::query("SELECT COUNT(*) AS count FROM data WHERE source = $1")
            .bind(source_id)
            .fetch_one(&pool)
            .await
            .unwrap()
            .get("count");
        assert_eq!(data_rows, 0, "data rows for the source should be deleted");

        let default_source: Option<i32> =
            sqlx::query("SELECT default_source FROM map_visualization WHERE id = $1")
                .bind(map_visualization_id)
                .fetch_one(&pool)
                .await
                .unwrap()
                .get("default_source");
        assert_eq!(
            default_source, None,
            "map visualization should remain with default_source cleared"
        );
    }
}
