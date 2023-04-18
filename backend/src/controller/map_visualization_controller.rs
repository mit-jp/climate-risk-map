use crate::{
    model::map_visualization::{Creator, Error, Json, JsonPatch, MapVisualization, Patch},
    AppState,
};
use actix_web::{delete, get, patch, post, web, HttpResponse, Responder};
use futures::future::try_join;
use log::error;
use serde::Deserialize;
use std::collections::HashMap;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get);
    cfg.service(get_all);
    cfg.service(get_by_dataset);
}

pub fn init_editor(cfg: &mut web::ServiceConfig) {
    cfg.service(patch);
    cfg.service(create);
    cfg.service(delete);
}

#[derive(Deserialize, Debug)]
pub struct MapVisualizationOptions {
    pub include_drafts: Option<bool>,
    pub geography_type: Option<i32>,
}

async fn get_map_visualization_model(
    map_visualization: MapVisualization,
    app_state: &web::Data<AppState<'_>>,
) -> Result<Json, sqlx::Error> {
    let sources_and_dates = app_state
        .database
        .source_and_date
        .by_dataset(map_visualization.dataset);
    let data_sources = app_state
        .database
        .data_source
        .by_dataset(map_visualization.dataset);
    let result = try_join(sources_and_dates, data_sources).await;
    match result {
        Err(e) => Err(e),
        Ok((source_and_dates, data_sources)) => {
            if data_sources.is_empty() {
                return Err(sqlx::Error::Decode(Box::new(Error {
                    message: format!(
                        "No sources and dates found for map visualization {map_visualization:#?}",
                    ),
                })));
            }
            Ok(Json::new(map_visualization, source_and_dates, data_sources))
        }
    }
}

#[get("/map-visualization/{id}")]
async fn get(app_state: web::Data<AppState<'_>>, id: web::Path<i32>) -> impl Responder {
    let map_visualization = app_state
        .database
        .map_visualization
        .get(id.into_inner())
        .await;
    match map_visualization {
        Err(e) => {
            error!("map vis: {}", e);
            HttpResponse::InternalServerError().finish()
        }
        Ok(map_visualization) => {
            let map_visualization_model =
                get_map_visualization_model(map_visualization, &app_state).await;
            match map_visualization_model {
                Err(e) => {
                    error!("map vis model: {}", e);
                    HttpResponse::InternalServerError().finish()
                }
                Ok(map_visualization_model) => HttpResponse::Ok().json(map_visualization_model),
            }
        }
    }
}

#[get("/dataset/{id}/map-visualization")]
async fn get_by_dataset(app_state: web::Data<AppState<'_>>, id: web::Path<i32>) -> impl Responder {
    let map_visualizations = app_state
        .database
        .map_visualization
        .get_by_dataset(id.into_inner())
        .await;
    match map_visualizations {
        Err(_) => HttpResponse::InternalServerError().finish(),
        Ok(map_visualizations) => {
            let maps_by_tab = by_tab(&app_state, map_visualizations).await;
            match maps_by_tab {
                Err(e) => {
                    error!("{}", e);
                    HttpResponse::InternalServerError().finish()
                }
                Ok(maps_by_tab) => HttpResponse::Ok().json(maps_by_tab),
            }
        }
    }
}

async fn by_tab(
    app_state: &web::Data<AppState<'_>>,
    map_visualizations: Vec<MapVisualization>,
) -> Result<HashMap<i32, HashMap<i32, Json>>, sqlx::Error> {
    let mut map_visualizations_by_category: HashMap<i32, HashMap<i32, Json>> = HashMap::new();
    for map_visualization in map_visualizations {
        let data_tab = map_visualization.data_tab;
        let map_visualization_model =
            get_map_visualization_model(map_visualization, app_state).await?;
        let map_visualizations_for_category = map_visualizations_by_category
            .entry(data_tab.unwrap_or(-1)) // store uncategorized map visualizations in category -1
            .or_insert_with(HashMap::new);
        map_visualizations_for_category.insert(map_visualization_model.id, map_visualization_model);
    }
    Ok(map_visualizations_by_category)
}

#[get("/map-visualization")]
async fn get_all(
    app_state: web::Data<AppState<'_>>,
    info: web::Query<MapVisualizationOptions>,
) -> impl Responder {
    let map_visualizations = app_state
        .database
        .map_visualization
        .all(info.include_drafts.unwrap_or(false), info.geography_type)
        .await;
    match map_visualizations {
        Err(e) => {
            error!("{}", e);
            HttpResponse::NotFound().finish()
        }
        Ok(map_visualizations) => {
            let maps_by_tab = by_tab(&app_state, map_visualizations).await;
            match maps_by_tab {
                Err(e) => {
                    error!("{}", e);
                    HttpResponse::InternalServerError().finish()
                }
                Ok(maps_by_tab) => HttpResponse::Ok().json(maps_by_tab),
            }
        }
    }
}

#[patch("/map-visualization")]
async fn patch(patch: web::Json<JsonPatch>, app_state: web::Data<AppState<'_>>) -> impl Responder {
    let result = app_state
        .database
        .map_visualization
        .update(&Patch::new(patch.into_inner()))
        .await;
    match result {
        Err(_) => HttpResponse::InternalServerError().finish(),
        Ok(_) => HttpResponse::Ok().finish(),
    }
}

#[post("/map-visualization")]
async fn create(app_state: web::Data<AppState<'_>>) -> impl Responder {
    let dataset = app_state.database.dataset.first().await;
    match dataset {
        Err(e) => {
            error!("{}", e);
            HttpResponse::InternalServerError().finish()
        }
        Ok(dataset) => {
            let result = app_state
                .database
                .map_visualization
                .create(&Creator {
                    dataset: dataset.id,
                    map_type: 1,
                    color_palette: 1,
                    scale_type: 2,
                    formatter_type: 3,
                })
                .await;
            match result {
                Err(e) => {
                    error!("{}", e);
                    HttpResponse::InternalServerError().finish()
                }
                Ok(_) => HttpResponse::Ok().finish(),
            }
        }
    }
}

#[delete("/map-visualization/{id}")]
async fn delete(id: web::Path<i32>, app_state: web::Data<AppState<'_>>) -> impl Responder {
    let result = app_state
        .database
        .map_visualization
        .delete(id.into_inner())
        .await;
    match result {
        Err(_) => HttpResponse::InternalServerError().finish(),
        Ok(_) => HttpResponse::Ok().finish(),
    }
}
