use actix_web::{test, App};
use climate_risk_map::config::Config;

#[test]
fn basic_test() {
    let config = Config::from_env();
    let database = Database::new(&config.database_url()).await;
    let editor_database = Database::new(&config.database_url()).await;
    let app_state = web::Data::new(AppState {
        connections: Mutex::new(0),
        database: Arc::new(database),
    });
    let app = test::init_service(App::new().app_data(app_state.clone())).await;
    assert_eq!(1, 1);
}
