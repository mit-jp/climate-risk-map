use super::AppState;
use crate::model::dataset::Diff;
use actix_web::{delete, get, patch, web, HttpResponse, Responder};
use derive_more::Display;
use log::error;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
    cfg.service(get);
}

pub fn init_editor(cfg: &mut web::ServiceConfig) {
    cfg.service(update);
    cfg.service(delete);
}

#[patch("/dataset")]
async fn update(app_state: web::Data<AppState<'_>>, dataset: web::Json<Diff>) -> impl Responder {
    let result = app_state.database.dataset.update(&dataset).await;

    match result {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(_) => HttpResponse::Ok().finish(),
    }
}

#[get("/dataset/{id}")]
async fn get(id: web::Path<i32>, app_state: web::Data<AppState<'_>>) -> impl Responder {
    let datasets = app_state.database.dataset.by_id(id.into_inner()).await;

    match datasets {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(datasets) => HttpResponse::Ok().json(datasets),
    }
}

#[get("/dataset")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    let datasets = app_state.database.dataset.all().await;

    match datasets {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(datasets) => HttpResponse::Ok().json(datasets),
    }
}

#[delete("/dataset/{id}")]
async fn delete(id: web::Path<i32>, app_state: web::Data<AppState<'_>>) -> Result<String, Error> {
    let id = id.into_inner();
    // Delete the dataset and everything that references it in one transaction,
    // so a failing step can't leave the dataset partially deleted
    let mut tx = app_state
        .database
        .dataset
        .pool
        .begin()
        .await
        .map_err(Error)?;
    sqlx::query!(
        "DELETE FROM map_visualization_collection
        USING map_visualization
        WHERE map_visualization_collection.map_visualization = map_visualization.id
        AND map_visualization.dataset = $1",
        id
    )
    .execute(&mut tx)
    .await
    .map_err(Error)?;
    sqlx::query!("DELETE FROM map_visualization WHERE dataset = $1", id)
        .execute(&mut tx)
        .await
        .map_err(Error)?;
    sqlx::query!("DELETE FROM data WHERE dataset = $1", id)
        .execute(&mut tx)
        .await
        .map_err(Error)?;
    sqlx::query!("DELETE FROM dataset WHERE id = $1", id)
        .execute(&mut tx)
        .await
        .map_err(Error)?;
    tx.commit().await.map_err(Error)?;
    Ok("deleted".to_string())
}

#[derive(Debug, Display)]
struct Error(sqlx::Error);

#[cfg(test)]
mod tests {
    use super::*;
    use crate::dao::Database;
    use actix_web::{test, App};
    use sqlx::PgPool;
    use std::sync::{Arc, Mutex};

    async fn insert_dataset(pool: &PgPool, short_name: &str, name: &str) -> i32 {
        sqlx::query_scalar(
            "INSERT INTO dataset (short_name, name, description, units, geography_type)
            VALUES ($1, $2, 't', 't', 1) RETURNING id",
        )
        .bind(short_name)
        .bind(name)
        .fetch_one(pool)
        .await
        .unwrap()
    }

    async fn insert_map_visualization(pool: &PgPool, id: i32, dataset: i32) {
        sqlx::query(
            "INSERT INTO map_visualization (id, dataset, map_type, color_palette, scale_type, formatter_type)
            VALUES ($1, $2, 1, 1, 2, 3)",
        )
        .bind(id)
        .bind(dataset)
        .execute(pool)
        .await
        .unwrap();
    }

    async fn count(pool: &PgPool, query: &str, id: i32) -> i64 {
        sqlx::query_scalar(query)
            .bind(id)
            .fetch_one(pool)
            .await
            .unwrap()
    }

    #[sqlx::test]
    async fn delete_removes_only_the_datasets_own_map_visualizations(pool: PgPool) {
        let dataset = insert_dataset(&pool, "ds_cascade_test", "Ds Cascade Test").await;
        let bystander_dataset = insert_dataset(&pool, "ds_bystander", "Ds Bystander").await;
        insert_map_visualization(&pool, dataset + 1000, dataset).await;
        // A map visualization whose id collides with the deleted dataset's id,
        // to catch a cascade that filters map visualizations by id instead of dataset
        insert_map_visualization(&pool, dataset, bystander_dataset).await;

        let app_state = web::Data::new(AppState {
            connections: Mutex::new(0),
            database: Arc::new(Database::from_pool(pool.clone())),
        });
        let app = test::init_service(App::new().app_data(app_state).configure(init_editor)).await;

        let request = test::TestRequest::delete()
            .uri(&format!("/dataset/{dataset}"))
            .to_request();
        let response = test::call_service(&app, request).await;

        assert!(response.status().is_success());
        assert_eq!(
            count(&pool, "SELECT count(*) FROM dataset WHERE id = $1", dataset).await,
            0
        );
        assert_eq!(
            count(
                &pool,
                "SELECT count(*) FROM map_visualization WHERE dataset = $1",
                dataset
            )
            .await,
            0
        );
        assert_eq!(
            count(
                &pool,
                "SELECT count(*) FROM map_visualization WHERE id = $1",
                dataset
            )
            .await,
            1
        );
    }
}

impl actix_web::error::ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
        error!("{self}");
        HttpResponse::build(self.status_code()).finish()
    }
}
