mod county;
mod data;
mod data_category;
mod data_source;
mod dataset;
mod domain;
mod map_visualization;
mod state;

pub type DataSource = data_source::DataSource;
pub type State = state::State;
pub type County = county::County;
pub type Data = data::Data;
pub type SourceAndDate = data::SourceAndDate;
pub type Dataset = dataset::Dataset;
pub type MapVisualization = map_visualization::MapVisualization;
pub type MapVisualizationModel = map_visualization::MapVisualizationModel;
pub type DataCategory = data_category::DataCategory;
pub type Domain = domain::Domain;
