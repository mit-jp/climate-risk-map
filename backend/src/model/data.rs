use chrono::NaiveDate;
use derivative::Derivative;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, FromRow, Serialize)]
pub struct PercentileData {
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
pub struct Data {
    pub id: i32,
    pub source: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub value: Option<f64>,
}

#[derive(Derivative)]
#[derivative(Eq, PartialEq, Hash, Debug)]
pub struct NewData {
    pub county_id: i16,
    pub state_id: i16,
    pub source: i32,
    pub dataset: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    #[derivative(Hash = "ignore", PartialEq = "ignore")]
    pub value: Option<f64>,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct SimpleData {
    pub id: i32,
    pub value: Option<f64>,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct SourceAndDate {
    pub source: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
}
