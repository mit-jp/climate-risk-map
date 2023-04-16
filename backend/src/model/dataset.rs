use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use str_slug::slug;

use super::upload_metadata::Column;

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
pub struct Diff {
    pub id: i32,
    pub short_name: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub geography_type: Option<i32>,
    pub units: Option<String>,
}

#[derive(Deserialize, Serialize, Debug, PartialEq)]
pub struct Creator {
    pub columns: Vec<Column>,
    pub name: String,
    pub short_name: String,
    pub units: String,
    pub geography_type: i32,
    pub description: String,
}

impl Creator {
    pub fn from(dataset: Json, geography_type: i32) -> Self {
        Creator {
            columns: dataset.columns,
            short_name: slug(&dataset.name),
            name: dataset.name,
            units: dataset.units,
            description: dataset.description,
            geography_type,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct Json {
    pub columns: Vec<Column>,
    pub name: String,
    pub units: String,
    pub description: String,
}
