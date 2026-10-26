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
async fn delete(
    id: web::Path<i32>,
    app_state: web::Data<AppState<'_>>,
) -> Result<HttpResponse, Error> {
    app_state
        .database
        .data_source
        .delete_cascading(id.into_inner())
        .await
        .map_err(Error)?;
    Ok(HttpResponse::Ok().finish())
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
    use actix_web::http::StatusCode;
    use actix_web::{test, App};
    use sqlx::PgPool;
    use std::sync::{Arc, Mutex};

    struct Seed {
        source_id: i32,
        map_visualization_id: i32,
    }

    async fn seed(pool: &PgPool) -> Seed {
        let source_id = sqlx::query!(
            "INSERT INTO data_source (name, description, link)
             VALUES ('src cascade test', 'test source', 'https://example.com')
             RETURNING id"
        )
        .fetch_one(pool)
        .await
        .unwrap()
        .id;

        let dataset_id = sqlx::query!(
            "INSERT INTO dataset (short_name, name, description, units, geography_type)
             VALUES ('src_cascade_test', 'Src Cascade Test', 't', 't', 1)
             RETURNING id"
        )
        .fetch_one(pool)
        .await
        .unwrap()
        .id;

        let map_visualization_id = sqlx::query!(
            "INSERT INTO map_visualization
                 (dataset, map_type, color_palette, scale_type, formatter_type, default_source)
             VALUES ($1, 1, 1, 2, 3, $2)
             RETURNING id",
            dataset_id,
            source_id
        )
        .fetch_one(pool)
        .await
        .unwrap()
        .id;

        sqlx::query!(
            "INSERT INTO data (dataset, source, start_date, end_date, value, geography_type, id)
             SELECT $1, $2, '2020-01-01', '2020-12-31', 1.0, geography_type, id
             FROM geo_id LIMIT 1",
            dataset_id,
            source_id
        )
        .execute(pool)
        .await
        .unwrap();

        Seed {
            source_id,
            map_visualization_id,
        }
    }

    async fn call_delete(pool: &PgPool, source_id: i32) -> StatusCode {
        let app_state = web::Data::new(AppState {
            connections: Mutex::new(0),
            database: Arc::new(Database::from_pool(pool.clone())),
        });
        let app = test::init_service(App::new().app_data(app_state).configure(init_editor)).await;
        let request = test::TestRequest::delete()
            .uri(&format!("/data-source/{source_id}"))
            .to_request();
        test::call_service(&app, request).await.status()
    }

    async fn source_count(pool: &PgPool, source_id: i32) -> i64 {
        sqlx::query!(
            r#"SELECT COUNT(*) AS "count!" FROM data_source WHERE id = $1"#,
            source_id
        )
        .fetch_one(pool)
        .await
        .unwrap()
        .count
    }

    async fn data_count(pool: &PgPool, source_id: i32) -> i64 {
        sqlx::query!(
            r#"SELECT COUNT(*) AS "count!" FROM data WHERE source = $1"#,
            source_id
        )
        .fetch_one(pool)
        .await
        .unwrap()
        .count
    }

    async fn default_source(pool: &PgPool, map_visualization_id: i32) -> Option<i32> {
        sqlx::query!(
            "SELECT default_source FROM map_visualization WHERE id = $1",
            map_visualization_id
        )
        .fetch_one(pool)
        .await
        .unwrap()
        .default_source
    }

    #[sqlx::test]
    async fn delete_clears_default_source_and_cascades(pool: PgPool) {
        let seed = seed(&pool).await;

        let status = call_delete(&pool, seed.source_id).await;
        assert!(status.is_success(), "expected success, got {}", status);

        assert_eq!(
            source_count(&pool, seed.source_id).await,
            0,
            "data_source row should be deleted"
        );
        assert_eq!(
            data_count(&pool, seed.source_id).await,
            0,
            "data rows for the source should be deleted"
        );
        assert_eq!(
            default_source(&pool, seed.map_visualization_id).await,
            None,
            "map visualization should remain with default_source cleared"
        );
    }

    #[sqlx::test]
    async fn delete_rolls_back_when_source_is_still_referenced(pool: PgPool) {
        let seed = seed(&pool).await;
        // A table the cascade doesn't know about, referencing data_source: the
        // scenario that future_model created in 2023. Runtime queries because
        // the table doesn't exist at compile time.
        sqlx::query("CREATE TABLE blocker (source INT NOT NULL REFERENCES data_source(id))")
            .execute(&pool)
            .await
            .unwrap();
        sqlx::query("INSERT INTO blocker (source) VALUES ($1)")
            .bind(seed.source_id)
            .execute(&pool)
            .await
            .unwrap();

        let status = call_delete(&pool, seed.source_id).await;
        assert!(status.is_server_error(), "expected error, got {}", status);

        assert_eq!(
            source_count(&pool, seed.source_id).await,
            1,
            "data_source should survive the failed delete"
        );
        assert_eq!(
            data_count(&pool, seed.source_id).await,
            1,
            "data row deletion should be rolled back"
        );
        assert_eq!(
            default_source(&pool, seed.map_visualization_id).await,
            Some(seed.source_id),
            "default_source should be rolled back"
        );
    }
}
