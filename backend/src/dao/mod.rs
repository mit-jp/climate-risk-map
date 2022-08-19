use super::model::{
    ColorPalette, CountryData, CountrySimpleData, County, DataCategory, DataSource, Dataset,
    MapVisualization, MapVisualizationDaoPatch, ScaleType, SourceAndDate, State, USACountyData,
    USACountySimpleData,
};

mod color_palette_dao;
mod country_data_dao;
mod county_dao;
mod data_category_dao;
mod data_source_dao;
pub mod database;
mod dataset_dao;
mod map_visualization_dao;
mod scale_type_dao;
mod source_and_date_dao;
mod state_dao;
mod usa_county_data_dao;

pub type Database<'c> = database::Database<'c>;
pub type Table<'c, T> = database::Table<'c, T>;
