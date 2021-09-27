use super::model::{
    ColorPalette, County, Data, DataCategory, DataSource, Dataset, Domain, MapVisualization,
    SimpleData, SourceAndDate, State,
};

mod color_palette_dao;
mod county_dao;
mod data_category_dao;
mod data_dao;
mod data_source_dao;
pub mod database;
mod dataset_dao;
mod domain_dao;
mod map_visualization_dao;
mod source_and_date_dao;
mod state_dao;

pub type Database<'c> = database::Database<'c>;
pub type Table<'c, T> = database::Table<'c, T>;
