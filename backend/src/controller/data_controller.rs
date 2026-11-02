use super::AppState;
use crate::controller::csv_converter;
use crate::model::data::SourceAndDate;
use actix_web::delete;
use actix_web::{get, web, HttpResponse, Responder};
use chrono::NaiveDate;
use serde::Deserialize;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_by_dataset);
    cfg.service(get_percentiles);
    cfg.service(get_state_percentiles);
    cfg.service(get_by_map_visualization);
}

pub fn init_editor(cfg: &mut web::ServiceConfig) {
    cfg.service(delete);
}

#[derive(Deserialize, Debug)]
struct Info {
    source: i32,
    start_date: NaiveDate,
    end_date: NaiveDate,
}

#[derive(Deserialize)]
pub struct PercentileInfo {
    pub category: i32,
    pub geo_id: i64,
    pub geography_type: i32,
}

#[get("/data/{dataset}")]
async fn get_by_dataset(
    dataset: web::Path<i32>,
    info: web::Query<Info>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let data = app_state
        .database
        .data
        .by_dataset(
            dataset.into_inner(),
            &SourceAndDate {
                source: info.source,
                start_date: info.start_date,
                end_date: info.end_date,
            },
        )
        .await;

    match data {
        Ok(data) => match csv_converter::convert(data) {
            Ok(csv) => HttpResponse::Ok().content_type("text/csv").body(csv),
            Err(_) => HttpResponse::NotFound().finish(),
        },
        Err(_) => HttpResponse::NotFound().finish(),
    }
}

#[get("/map-visualization/{map_visualization}/data")]
async fn get_by_map_visualization(
    map_visualization: web::Path<i32>,
    info: web::Query<Info>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let result = app_state
        .database
        .data
        .by_map_visualization(
            map_visualization.into_inner(),
            &SourceAndDate {
                source: info.source,
                start_date: info.start_date,
                end_date: info.end_date,
            },
        )
        .await;
    match result {
        Ok(result) => {
            let csv = csv_converter::convert(result);
            match csv {
                Ok(csv) => HttpResponse::Ok().content_type("text/csv").body(csv),
                Err(_) => HttpResponse::NotFound().finish(),
            }
        }
        Err(_) => HttpResponse::NotFound().finish(),
    }
}

#[get("/percentile")]
async fn get_percentiles(
    info: web::Query<PercentileInfo>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let data = app_state.database.data.percentile(info.into_inner()).await;

    match data {
        Ok(data) => match csv_converter::convert(data) {
            Ok(csv) => HttpResponse::Ok().content_type("text/csv").body(csv),
            Err(_) => HttpResponse::NotFound().finish(),
        },
        Err(_) => HttpResponse::NotFound().finish(),
    }
}

#[get("/state_percentile")]
async fn get_state_percentiles(
    info: web::Query<PercentileInfo>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let data = app_state
        .database
        .data
        .state_percentile(info.into_inner())
        .await;

    match data {
        Ok(data) => match csv_converter::convert(data) {
            Ok(csv) => HttpResponse::Ok().content_type("text/csv").body(csv),
            Err(_) => HttpResponse::NotFound().finish(),
        },
        Err(_) => HttpResponse::NotFound().finish(),
    }
}

#[delete("/dataset/{dataset}/data")]
async fn delete(app_state: web::Data<AppState<'_>>, dataset: web::Path<i32>) -> impl Responder {
    let result = app_state
        .database
        .data
        .delete_by_dataset(dataset.into_inner())
        .await;

    match result {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::NotFound().finish(),
    }
}

#[cfg(test)]
mod tests {
    use super::{init_editor, PercentileInfo};
    use crate::model::map_visualization::Json;
    use crate::{dao::Database, AppState};
    use actix_web::{test, web, App};
    use chrono::{Datelike, NaiveDate};
    use sqlx::{PgPool, Row};
    use std::sync::{Arc, Mutex};

    /// Seeds a published map visualization with three sources, whose dataset has data for each
    /// (source index, year). Returns the (source index, year) that the percentile queries
    /// resolve as its default, after checking that they agree with map_visualization::Data.
    async fn resolve_default(
        pool: &PgPool,
        years: &[(usize, i32)],
        default: Option<(usize, i32)>,
    ) -> (usize, i32) {
        let mut source_ids = Vec::new();
        for index in 0..3 {
            let source_id: i32 = sqlx::query(
                "INSERT INTO data_source (name, description, link)
                VALUES ('percentile test ' || $1, 't', 't') RETURNING id",
            )
            .bind(index)
            .fetch_one(pool)
            .await
            .unwrap()
            .get(0);
            source_ids.push(source_id);
        }
        let year_start = |year: i32| NaiveDate::from_ymd_opt(year, 1, 1).unwrap();
        let year_end = |year: i32| NaiveDate::from_ymd_opt(year, 12, 31).unwrap();
        let dataset_id: i32 = sqlx::query(
            "INSERT INTO dataset (short_name, name, description, units, geography_type)
            VALUES ('percentile_test', 'Percentile Test', 't', 't', 1) RETURNING id",
        )
        .fetch_one(pool)
        .await
        .unwrap()
        .get(0);
        let map_id: i32 = sqlx::query(
            "INSERT INTO map_visualization
                (dataset, map_type, color_palette, scale_type, formatter_type,
                 default_source, default_start_date, default_end_date)
            VALUES ($1, 1, 1, 2, 3, $2, $3, $4) RETURNING id",
        )
        .bind(dataset_id)
        .bind(default.map(|(source, _)| source_ids[source]))
        .bind(default.map(|(_, year)| year_start(year)))
        .bind(default.map(|(_, year)| year_end(year)))
        .fetch_one(pool)
        .await
        .unwrap()
        .get(0);
        let category: i32 = sqlx::query(
            r#"INSERT INTO map_visualization_collection (map_visualization, category, "order")
            SELECT $1, MIN(id), 32000 FROM data_category RETURNING category::int4"#,
        )
        .bind(map_id)
        .fetch_one(pool)
        .await
        .unwrap()
        .get(0);
        let geo_id: i64 = sqlx::query("SELECT id FROM geo_id WHERE geography_type = 1 LIMIT 1")
            .fetch_one(pool)
            .await
            .unwrap()
            .get(0);
        for &(source, year) in years {
            sqlx::query(
                "INSERT INTO data (dataset, source, start_date, end_date, value, geography_type, id)
                VALUES ($1, $2, $3, $4, 1.0, 1, $5)",
            )
            .bind(dataset_id)
            .bind(source_ids[source])
            .bind(year_start(year))
            .bind(year_end(year))
            .bind(geo_id)
            .execute(pool)
            .await
            .unwrap();
        }

        let database = Database::from_pool(pool.clone());
        let info = || PercentileInfo {
            category,
            geo_id,
            geography_type: 1,
        };
        let mut resolutions = Vec::new();
        for percentiles in [
            database.data.percentile(info()).await.unwrap(),
            database.data.state_percentile(info()).await.unwrap(),
        ] {
            let percentile = percentiles
                .into_iter()
                .find(|percentile| percentile.dataset == dataset_id)
                .expect("expected a percentile for the dataset");
            resolutions.push((percentile.source, percentile.start_date));
        }
        let map_visualization = database.map_visualization.get(map_id).await.unwrap();
        let dated_sources = database.data_source.by_dataset(dataset_id).await.unwrap();
        let default_source = Json::new(map_visualization, dated_sources)
            .data
            .unwrap()
            .default_source;
        let resolution = (
            default_source.source.id,
            default_source.default_date_range.start_date,
        );
        assert_eq!(resolutions, vec![resolution, resolution]);
        (
            source_ids
                .iter()
                .position(|&id| id == resolution.0)
                .unwrap(),
            resolution.1.year(),
        )
    }

    #[sqlx::test]
    async fn percentiles_default_to_the_first_source_and_its_latest_date(pool: PgPool) {
        let resolved = resolve_default(&pool, &[(0, 2020), (1, 2010)], None).await;
        assert_eq!(resolved, (0, 2020));
    }

    #[sqlx::test]
    async fn percentiles_use_the_configured_default(pool: PgPool) {
        let resolved =
            resolve_default(&pool, &[(0, 2020), (1, 2010), (1, 2015)], Some((1, 2010))).await;
        assert_eq!(resolved, (1, 2010));
    }

    #[sqlx::test]
    async fn percentiles_ignore_a_default_date_the_default_source_lacks(pool: PgPool) {
        let resolved = resolve_default(&pool, &[(0, 2020), (1, 2010)], Some((1, 2020))).await;
        assert_eq!(resolved, (1, 2010));
    }

    #[sqlx::test]
    async fn percentiles_ignore_a_default_source_without_data(pool: PgPool) {
        let resolved = resolve_default(&pool, &[(0, 2020), (1, 2010)], Some((2, 2010))).await;
        assert_eq!(resolved, (0, 2020));
    }

    #[sqlx::test]
    async fn delete_clears_the_defaults_that_refer_to_the_data(pool: PgPool) {
        let source_id: i32 = sqlx::query(
            "INSERT INTO data_source (name, description, link)
            VALUES ('data delete test', 't', 't') RETURNING id",
        )
        .fetch_one(&pool)
        .await
        .unwrap()
        .get(0);
        let dataset_id: i32 = sqlx::query(
            "INSERT INTO dataset (short_name, name, description, units, geography_type)
            VALUES ('data_delete_test', 'Data Delete Test', 't', 't', 1) RETURNING id",
        )
        .fetch_one(&pool)
        .await
        .unwrap()
        .get(0);
        let map_id: i32 = sqlx::query(
            "INSERT INTO map_visualization
                (dataset, map_type, color_palette, scale_type, formatter_type,
                 default_source, default_start_date, default_end_date)
            VALUES ($1, 1, 1, 2, 3, $2, '2020-01-01', '2020-12-31') RETURNING id",
        )
        .bind(dataset_id)
        .bind(source_id)
        .fetch_one(&pool)
        .await
        .unwrap()
        .get(0);
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
            .uri(&format!("/dataset/{dataset_id}/data"))
            .to_request();
        let status = test::call_service(&app, request).await.status();

        assert!(status.is_success(), "delete failed with status {}", status);
        let data_count: i64 = sqlx::query("SELECT count(*) FROM data WHERE dataset = $1")
            .bind(dataset_id)
            .fetch_one(&pool)
            .await
            .unwrap()
            .get(0);
        assert_eq!(data_count, 0);
        let defaults_count: i64 = sqlx::query(
            "SELECT count(*) FROM map_visualization
            WHERE id = $1 AND (default_source IS NOT NULL OR default_start_date IS NOT NULL)",
        )
        .bind(map_id)
        .fetch_one(&pool)
        .await
        .unwrap()
        .get(0);
        assert_eq!(defaults_count, 0);
    }
}
