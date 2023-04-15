use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(FromRow, Deserialize, Serialize, Debug, Clone)]
pub struct Dataset {
    pub id: i32,
    pub short_name: String,
    pub name: String,
    pub description: String,
    pub geography_type: i32,
    pub units: String,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct DatasetDiff {
    pub id: i32,
    pub short_name: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub geography_type: Option<i32>,
    pub units: Option<String>,
}
