use serde::Serialize;
use sqlx::FromRow;

#[derive(FromRow, Serialize)]
pub struct Type {
    pub id: i32,
    pub name: String,
}
