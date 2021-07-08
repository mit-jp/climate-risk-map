use super::model::{County, Data, DataCategory, Dataset, MapVisualization, State};

mod county_dao;
mod data_category_dao;
mod data_dao;
pub mod database;
mod dataset_dao;
mod map_visualization_dao;
mod state_dao;

pub type Database<'c> = database::Database<'c>;
pub type Table<'c, T> = database::Table<'c, T>;
