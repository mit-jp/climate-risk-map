use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(FromRow, Deserialize, Serialize)]
pub struct DataSource {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub link: String,
}
