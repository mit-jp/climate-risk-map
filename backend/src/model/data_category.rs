use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(FromRow, Deserialize, Serialize)]
pub struct DataCategory {
    pub id: i32,
    pub name: String,
}
