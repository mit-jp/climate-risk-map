use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(FromRow, Deserialize, Serialize)]
pub struct Dataset {
    pub id: i32,
    pub short_name: String,
    pub name: String,
    pub description: String,
    pub units: String,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct DatasetDiff {
    pub id: i32,
    pub short_name: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub units: Option<String>,
}
