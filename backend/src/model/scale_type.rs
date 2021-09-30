use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(FromRow, Deserialize, Serialize)]
pub struct ScaleType {
    pub id: i32,
    pub name: String,
}
