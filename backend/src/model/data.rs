use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, FromRow, Serialize)]
pub struct DataWithDataset {
    pub county_id: i16,
    pub state_id: i16,
    pub source: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub value: Option<f64>,
    pub dataset: i32,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct Data {
    pub county_id: i16,
    pub state_id: i16,
    pub source: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub value: Option<f64>,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct SimpleData {
    pub county_id: i16,
    pub state_id: i16,
    pub value: Option<f64>,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct SourceAndDate {
    pub source: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
}
