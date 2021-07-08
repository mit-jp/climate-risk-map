use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(FromRow, Deserialize, Serialize)]
pub struct County {
    id: i16,
    name: String,
    state: i16,
}
