use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(FromRow, Deserialize, Serialize)]
pub struct DataSource {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub link: String,
}

#[derive(Deserialize, Serialize)]
pub struct DataSourceDiff {
    pub id: i32,
    pub name: Option<String>,
    pub description: Option<String>,
    pub link: Option<String>,
}
