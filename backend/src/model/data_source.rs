use std::fmt::{Display, Formatter};

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

#[derive(Deserialize, Serialize)]
pub struct DataSourceDiff {
    pub id: i32,
    pub name: Option<String>,
    pub description: Option<String>,
    pub link: Option<String>,
}

#[derive(Deserialize, Serialize, FromRow, Debug, PartialEq)]
pub struct NewDataSource {
    pub name: String,
    pub description: String,
    pub link: String,
}
