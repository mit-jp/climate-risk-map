use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(FromRow, Deserialize, Serialize)]
pub struct MapVisualizationCollection {
    pub order: i16,
    pub category: i32,
    pub map_visualization: i32,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct MapVisualizationCollectionId {
    pub category: i32,
    pub map_visualization: i32,
}
