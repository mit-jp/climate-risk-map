use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(FromRow, Deserialize, Serialize)]
pub struct Data {
    pub county_id: i16,
    pub state_id: i16,
    pub source: i16,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub value: Option<f64>,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct SourceAndDate {
    pub source: i16,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
}
