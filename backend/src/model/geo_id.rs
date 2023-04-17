use derive_more::Display;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(FromRow, PartialEq, Eq, Hash, Debug, Display, Serialize)]
#[display(fmt = "GeoId(id: {id}, geography_type: {geography_type})")]
pub struct GeoId {
    pub id: i32,
    pub geography_type: i32,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct State {
    pub id: i32,
    pub name: String,
}

#[derive(FromRow, Deserialize, Serialize, PartialEq, Debug)]
pub struct County {
    pub id: i32,
    pub name: String,
}
