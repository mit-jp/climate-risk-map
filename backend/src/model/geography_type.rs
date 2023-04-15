use serde::Serialize;
use sqlx::FromRow;

#[derive(FromRow, Serialize)]
pub struct GeographyType {
    pub id: i32,
    pub name: String,
}
