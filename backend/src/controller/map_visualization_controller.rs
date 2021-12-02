use super::{AppState, MapVisualizationModel};
use crate::model::{MapVisualization, MapVisualizationDaoPatch, MapVisualizationPatch};
use actix_web::{get, patch, web, HttpResponse, Responder};
use futures::future::try_join4;
use std::collections::HashMap;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get);
    cfg.service(get_all);
}

pub fn init_editor(cfg: &mut web::ServiceConfig) {
    cfg.service(patch);
}

async fn get_map_visualization_model(
    map_visualization: MapVisualization,
    app_state: &web::Data<AppState<'_>>,
) -> Result<MapVisualizationModel, sqlx::Error> {
    let sources_and_dates = app_state
        .database
        .source_and_date
        .by_dataset(map_visualization.dataset);
    let data_sources = app_state
        .database
        .data_source
        .by_dataset(map_visualization.dataset);
    let pdf_domain = app_state.database.domain.pdf(map_visualization.id);
    let scale_domain = app_state.database.domain.scale(map_visualization.id);
    let result = try_join4(sources_and_dates, data_sources, pdf_domain, scale_domain).await;
    match result {
        Err(e) => Err(e),
        Ok((sources_and_dates, data_sources, pdf_domain, scale_domain)) => {
            Ok(MapVisualizationModel::new(
                map_visualization,
                sources_and_dates,
                data_sources,
                pdf_domain.into_iter().map(|x| x.value).collect(),
                scale_domain.into_iter().map(|x| x.value).collect(),
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
        Err(_) => HttpResponse::InternalServerError().finish(),
        Ok(map_visualization) => {
            let map_visualization_model =
                get_map_visualization_model(map_visualization, &app_state).await;
            match map_visualization_model {
                Err(_) => HttpResponse::InternalServerError().finish(),
                Ok(map_visualization_model) => HttpResponse::Ok().json(map_visualization_model),
            }
        }
    }
}

#[get("/map-visualization")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    let map_visualizations = app_state.database.map_visualization.all().await;
    match map_visualizations {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(map_visualizations) => {
            let mut map_visualizations_by_category: HashMap<
                i32,
                HashMap<i32, MapVisualizationModel>,
            > = HashMap::new();
            for map_visualization in map_visualizations {
                let data_tab = map_visualization.data_tab;
                let map_visualization_model =
                    get_map_visualization_model(map_visualization, &app_state).await;
                if map_visualization_model.is_err() {
                    return HttpResponse::InternalServerError().finish();
                }
                let map_visualization_model = map_visualization_model.unwrap();
                let map_visualizations_for_category = map_visualizations_by_category
                    .entry(data_tab)
                    .or_insert_with(HashMap::new);
                map_visualizations_for_category
                    .insert(map_visualization_model.id, map_visualization_model);
            }
            HttpResponse::Ok().json(map_visualizations_by_category)
        }
    }
}

#[patch("/map-visualization/{id}")]
async fn patch(
    id: web::Path<i32>,
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
