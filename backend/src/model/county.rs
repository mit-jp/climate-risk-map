use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(FromRow, Deserialize, Serialize, PartialEq, Debug)]
pub struct County {
    pub id: i16,
    pub name: String,
    pub state: i16,
}
