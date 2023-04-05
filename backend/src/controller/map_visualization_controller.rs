use super::{AppState, MapVisualizationModel};
use crate::model::{
    GeographyType, MapVisualization, MapVisualizationDaoPatch, MapVisualizationError,
    MapVisualizationPatch,
};
use actix_web::{get, patch, post, web, HttpResponse, Responder};
use futures::future::try_join;
use log::error;
use serde::Deserialize;
use std::collections::HashMap;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get);
    cfg.service(get_all);
}

pub fn init_editor(cfg: &mut web::ServiceConfig) {
    cfg.service(patch);
    cfg.service(create);
}

#[derive(Deserialize, Debug)]
pub struct MapVisualizationOptions {
    pub include_drafts: Option<bool>,
    pub geography_type: Option<i32>,
}

async fn get_map_visualization_model(
    map_visualization: MapVisualization,
    app_state: &web::Data<AppState<'_>>,
) -> Result<MapVisualizationModel, sqlx::Error> {
    let geography_type = match map_visualization.geography_type {
        1 => GeographyType::Usa,
        2 => GeographyType::World,
        _ => {
            error!(
                "Invalid geography type: {}",
                map_visualization.geography_type
            );
            return Err(sqlx::Error::Decode(Box::new(MapVisualizationError {
                message: "Invalid geography type".to_string(),
            })));
        }
    };
    let sources_and_dates = app_state
        .database
        .source_and_date
        .by_dataset(map_visualization.dataset, &geography_type);
    let data_sources = app_state
        .database
        .data_source
        .by_dataset(map_visualization.dataset, &geography_type);
    let result = try_join(sources_and_dates, data_sources).await;
    match result {
        Err(e) => Err(e),
        Ok((source_and_dates, data_sources)) => {
            if data_sources.is_empty() {
                return Err(sqlx::Error::Decode(Box::new(MapVisualizationError {
                    message: format!(
                        "No sources and dates found for map visualization {map_visualization:#?}",
                    ),
                })));
            }
            Ok(MapVisualizationModel::new(
                map_visualization,
                source_and_dates,
                data_sources,
            ))
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
            let mut map_visualizations_by_category: HashMap<
                i32,
                HashMap<i32, MapVisualizationModel>,
            > = HashMap::new();
            for map_visualization in map_visualizations {
                let data_tab = map_visualization.data_tab;
                let map_visualization_model =
                    get_map_visualization_model(map_visualization, &app_state).await;
                if let Err(e) = map_visualization_model {
                    error!("{}", e);
                    return HttpResponse::InternalServerError().finish();
                }
                let map_visualization_model = map_visualization_model.unwrap();
                let map_visualizations_for_category = map_visualizations_by_category
                    .entry(data_tab.unwrap_or(-1)) // store uncategorized map visualizations in category -1
                    .or_insert_with(HashMap::new);
                map_visualizations_for_category
                    .insert(map_visualization_model.id, map_visualization_model);
            }
            HttpResponse::Ok().json(map_visualizations_by_category)
        }
    }
}

#[patch("/map-visualization")]
async fn patch(
    patch: web::Json<MapVisualizationPatch>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let result = app_state
        .database
        .map_visualization
        .update(&MapVisualizationDaoPatch::new(patch.into_inner()))
        .await;
    match result {
        Err(_) => HttpResponse::InternalServerError().finish(),
        Ok(_) => HttpResponse::Ok().finish(),
    }
}

#[post("/map-visualization")]
async fn create(
    map_model: web::Json<MapVisualizationPatch>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let map = MapVisualizationDaoPatch::new(map_model.into_inner());
    let result = app_state.database.map_visualization.create(&map).await;
    match result {
        Err(_) => HttpResponse::InternalServerError().finish(),
        Ok(_) => HttpResponse::Ok().finish(),
    }
}
