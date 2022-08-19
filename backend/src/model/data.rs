use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, FromRow, Serialize)]
pub struct USACountyPercentileData {
    pub dataset: i32,
    pub dataset_name: String,
    pub source: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub percent_rank: Option<f64>,
    pub value: Option<f64>,
    pub units: String,
    pub formatter_type: i32,
    pub decimals: i16,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct USACountyData {
    pub county_id: i16,
    pub state_id: i16,
    pub source: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub value: Option<f64>,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct USACountySimpleData {
    pub county_id: i16,
    pub state_id: i16,
    pub value: Option<f64>,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct CountryData {
    pub id: i16,
    pub source: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub value: Option<f64>,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct CountrySimpleData {
    pub country_id: i16,
    pub value: Option<f64>,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct SourceAndDate {
    pub source: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
}
