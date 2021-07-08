use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(FromRow, Deserialize, Serialize)]
pub struct Data {
    pub county_id: i16,
    pub state_id: i16,
    pub value: f64,
}
