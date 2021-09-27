use super::{AppState, MapVisualizationModel};
use crate::model::ColorPalette;
use actix_web::{get, patch, web, HttpResponse, Responder};
use std::collections::HashMap;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
    cfg.service(update_color_palette);
}

#[get("/map-visualization")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    println!("GET: /map-visualization/");

    let map_visualizations = app_state.database.map_visualization.all().await;
    match map_visualizations {
        Err(e) => {
            println!("Error: {}", e);
            HttpResponse::NotFound().finish()
        }
        Ok(map_visualizations) => {
            let mut map_visualizations_by_category: HashMap<
                i32,
                HashMap<i32, MapVisualizationModel>,
            > = HashMap::new();
            for map_visualization in map_visualizations {
                let sources_and_dates = app_state
                    .database
                    .source_and_date
                    .by_dataset(map_visualization.dataset)
                    .await;
                let data_sources = app_state
                    .database
                    .data_source
                    .by_dataset(map_visualization.dataset)
                    .await;
                let pdf_domain = app_state.database.domain.pdf(map_visualization.id).await;
                let scale_domain = app_state.database.domain.scale(map_visualization.id).await;
                if sources_and_dates.is_err()
                    || data_sources.is_err()
                    || pdf_domain.is_err()
                    || scale_domain.is_err()
                {
                    return HttpResponse::NotFound().finish();
                }
                let map_visualizations_for_category = map_visualizations_by_category
                    .entry(map_visualization.data_tab)
                    .or_insert_with(HashMap::new);
                let map_visualization_model = MapVisualizationModel::new(
                    map_visualization,
                    sources_and_dates.unwrap(),
                    data_sources.unwrap(),
                    pdf_domain.unwrap().into_iter().map(|x| x.value).collect(),
                    scale_domain.unwrap().into_iter().map(|x| x.value).collect(),
                );
                map_visualizations_for_category
                    .insert(map_visualization_model.id, map_visualization_model);
            }
            HttpResponse::Ok().json(map_visualizations_by_category)
        }
    }
}

#[patch("/map-visualization/{id}")]
async fn update_color_palette(
    id: web::Path<i32>,
    color_palette: web::Json<ColorPalette>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    println!("PATCH: /map-visualization/{}", id);

    let result = app_state
        .database
        .map_visualization
        .set_color_palette(id.into_inner(), color_palette.id)
        .await;

    match result {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(_) => HttpResponse::Ok().finish(),
    }
}
