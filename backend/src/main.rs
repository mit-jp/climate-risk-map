use actix_web::{middleware::Logger, web, App, HttpServer};
use climate_risk_map::config::Config;
use climate_risk_map::dao::Database;
use climate_risk_map::{controller, AppState};
use env_logger::Env;
use futures::future;
use std::sync::{Arc, Mutex};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let config = Config::from_env();
    let database = Database::new(&config.database_url()).await;
    let editor_database = Database::new(&config.database_url()).await;
    let app_state = web::Data::new(AppState {
        connections: Mutex::new(0),
        database: Arc::new(database),
    });
    let editor_state = web::Data::new(AppState {
        connections: Mutex::new(0),
        database: Arc::new(editor_database),
    });
    env_logger::Builder::from_env(Env::default().default_filter_or("info,sqlx=error")).init();
    let read_only_app = HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .configure(controller::state_controller::init)
            .configure(controller::county_controller::init)
            .configure(controller::data_controller::init)
            .configure(controller::dataset_controller::init)
            .configure(controller::map_visualization_controller::init)
            .configure(controller::data_category_controller::init)
            .configure(controller::color_palette_controller::init)
            .configure(controller::scale_type_controller::init)
            .configure(controller::subcategory_controller::init)
            .configure(controller::data_source_controller::init)
            .configure(controller::geography_type_controller::init)
            .wrap(Logger::default())
    })
    .bind(config.app_url())?;
    let editor_app = HttpServer::new(move || {
        App::new()
            .app_data(editor_state.clone())
            .configure(controller::map_visualization_controller::init_editor)
            .configure(controller::map_visualization_collection_controller::init_editor)
            .configure(controller::data_category_controller::init_editor)
            .configure(controller::dataset_controller::init_editor)
            .configure(controller::data_source_controller::init_editor)
            .configure(controller::uploader_controller::init_editor)
            .wrap(Logger::default())
    })
    .bind(config.editor_url())?;
    future::try_join(read_only_app.run(), editor_app.run()).await?;
    Ok(())
}
