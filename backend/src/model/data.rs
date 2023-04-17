use chrono::NaiveDate;
use derivative::Derivative;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, FromRow, Serialize)]
pub struct Percentile {
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
    pub value: f64,
}

#[derive(Derivative)]
#[derivative(Eq, PartialEq, Hash, Debug)]
pub struct Creator {
    pub id: i32,
    pub geography_type: i32,
    pub source: i32,
    pub dataset: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    #[derivative(Hash = "ignore", PartialEq = "ignore")]
    pub value: f64,
}

impl Creator {
    pub fn new(data: &Parsed, dataset: i32, source: i32, geography_type: i32) -> Creator {
        Creator {
            id: data.id,
            start_date: data.start_date,
            end_date: data.end_date,
            value: data.value,
            dataset,
            source,
            geography_type,
        }
    }
}

#[derive(Derivative, Serialize)]
#[derivative(Eq, PartialEq, Hash, Debug)]
pub struct Parsed {
    pub dataset: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub id: i32,
    #[derivative(Hash = "ignore", PartialEq = "ignore")]
    pub value: f64,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct Simple {
    pub id: i32,
    pub value: f64,
}

#[derive(Deserialize)]
pub struct DeleteInfo {
    pub dataset: i32,
    pub source: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct SourceAndDate {
    pub source: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
}
