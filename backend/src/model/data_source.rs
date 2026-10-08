use std::fmt::{Display, Formatter};

use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(FromRow, Deserialize, Serialize, Debug)]
pub struct DataSource {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub link: String,
}

impl Display for DataSource {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.name)
    }
}

/// A data source together with one date range it has data for in a dataset
#[derive(FromRow, Debug)]
pub struct DatedSource {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub link: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
}

#[derive(Deserialize, Serialize)]
pub struct Diff {
    pub id: i32,
    pub name: Option<String>,
    pub description: Option<String>,
    pub link: Option<String>,
}

#[derive(Deserialize, Serialize, FromRow, Debug, PartialEq)]
pub struct Creator {
    pub name: String,
    pub description: String,
    pub link: String,
}
