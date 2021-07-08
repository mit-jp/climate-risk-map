use actix_web::{web, App, HttpServer};
use climate_risk_map::config::Config;
use climate_risk_map::dao::Database;
use climate_risk_map::{controller, AppState};
use std::sync::{Arc, Mutex};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let config = Config::from_env();
    let database = Database::new(&config.database_url()).await;
    let app_state = web::Data::new(AppState {
        connections: Mutex::new(0),
        database: Arc::new(database),
    });
    let app = HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .configure(controller::state_controller::init)
            .configure(controller::county_controller::init)
            .configure(controller::data_controller::init)
            .configure(controller::dataset_controller::init)
            .configure(controller::map_visualization_controller::init)
            .configure(controller::data_category_controller::init)
    })
    .bind(config.app_url())?;
    println!("Listening on: {}", config.app_url());
    app.run().await
}
