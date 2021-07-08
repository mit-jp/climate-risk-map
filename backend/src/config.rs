use dotenv::dotenv;
use std::env;

struct AppConfig {
    url: String,
    port: u16,
}
struct DaoConfig {
    url: String,
}
pub struct Config {
    app: AppConfig,
    dao: DaoConfig,
}

impl Config {
    pub fn from_env() -> Self {
        dotenv().ok();
        let app_config = AppConfig {
            url: env::var("APP_URL").expect("APP_URL is not set"),
            port: env::var("APP_PORT")
                .expect("APP_PORT is not set")
                .parse::<u16>()
                .unwrap(),
        };
        let dao_config = DaoConfig {
            url: env::var("DATABASE_URL").expect("DATABASE_URL is not set"),
        };
        Config {
            app: app_config,
            dao: dao_config,
        }
    }

    pub fn app_url(&self) -> String {
        format!("{0}:{1}", self.app.url, self.app.port)
    }

    pub fn database_url(&self) -> String {
        self.dao.url.to_string()
    }
}
