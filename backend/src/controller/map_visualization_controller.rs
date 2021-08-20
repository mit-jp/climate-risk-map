use super::{AppState, MapVisualizationModel};
use actix_web::{get, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
    cfg.service(get);
    cfg.service(get_by_data_category);
}

#[get("/data-category/{data_category}/map-visualization")]
async fn get_by_data_category(
    data_category: web::Path<i32>,
    app_state: web::Data<AppState<'_>>,
) -> impl Responder {
    let map_visualizations = app_state
        .database
        .map_visualization
        .by_data_category(data_category.into_inner())
        .await;
    match map_visualizations {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(map_visualizations) => {
            let mut map_visualization_models: Vec<MapVisualizationModel> = Vec::new();
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
                map_visualization_models.push(MapVisualizationModel::new(
                    map_visualization,
                    sources_and_dates.unwrap(),
                    data_sources.unwrap(),
                    pdf_domain.unwrap().into_iter().map(|x| x.value).collect(),
                    scale_domain.unwrap().into_iter().map(|x| x.value).collect(),
                ));
            }
            HttpResponse::Ok().json(map_visualization_models)
        }
    }
}

#[get("/map-visualization")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    println!("GET: /map-visualization/");

    let map_visualizations = app_state.database.map_visualization.all().await;
    match map_visualizations {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(map_visualizations) => HttpResponse::Ok().json(map_visualizations),
    }
}

#[get("/map-visualization/{id}")]
async fn get(id: web::Path<i32>, app_state: web::Data<AppState<'_>>) -> impl Responder {
    println!("GET: /map-visualization/{}", id);

    let counties = app_state
        .database
        .map_visualization
        .by_dataset(id.into_inner())
        .await;

    match counties {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(counties) => HttpResponse::Ok().json(counties),
    }
}
