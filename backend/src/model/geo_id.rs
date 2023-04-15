use derive_more::Display;
use serde::Serialize;
use sqlx::FromRow;

#[derive(FromRow, PartialEq, Eq, Hash, Debug, Display, Serialize)]
#[display(fmt = "GeoId(id: {id}, geography_type: {geography_type})")]
pub struct GeoId {
    pub id: i32,
    pub geography_type: i32,
}
