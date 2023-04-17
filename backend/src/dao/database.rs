use crate::model::color_palette::ColorPalette;
use crate::model::data::{Data, SourceAndDate};
use crate::model::data_category::DataCategory;
use crate::model::data_source::DataSource;
use crate::model::dataset::Dataset;
use crate::model::geo_id::{County, GeoId, State};
use crate::model::geography_type;
use crate::model::map_visualization::MapVisualization;
use crate::model::map_visualization_collection::Collection;
use crate::model::scale_type;
use crate::model::subcategory::Subcategory;
use sqlx::postgres::PgRow;
use sqlx::{FromRow, PgPool};
use std::sync::Arc;

pub struct Table<'c, T>
where
    T: FromRow<'c, PgRow>,
{
    pub pool: Arc<PgPool>,
    _from_row: fn(&'c PgRow) -> Result<T, sqlx::Error>,
}

impl<'c, T> Table<'c, T>
where
    T: FromRow<'c, PgRow>,
{
    fn new(pool: Arc<PgPool>) -> Self {
        Table {
            pool,
            _from_row: T::from_row,
        }
    }
}

pub struct Database<'c> {
    pub state: Arc<Table<'c, State>>,
    pub county: Arc<Table<'c, County>>,
    pub data: Arc<Table<'c, Data>>,
    pub dataset: Arc<Table<'c, Dataset>>,
    pub map_visualization: Arc<Table<'c, MapVisualization>>,
    pub map_visualization_collection: Arc<Table<'c, Collection>>,
    pub data_category: Arc<Table<'c, DataCategory>>,
    pub source_and_date: Arc<Table<'c, SourceAndDate>>,
    pub data_source: Arc<Table<'c, DataSource>>,
    pub color_palette: Arc<Table<'c, ColorPalette>>,
    pub scale_type: Arc<Table<'c, scale_type::Type>>,
    pub subcategory: Arc<Table<'c, Subcategory>>,
    pub geo_id: Arc<Table<'c, GeoId>>,
    pub geography_type: Arc<Table<'c, geography_type::Type>>,
}

impl Database<'_> {
    pub async fn new(sql_url: &str) -> Database<'_> {
        let pool = PgPool::connect(sql_url).await.unwrap();
        let pool = Arc::new(pool);

        Database {
            geography_type: Arc::from(Table::new(pool.clone())),
            geo_id: Arc::from(Table::new(pool.clone())),
            state: Arc::from(Table::new(pool.clone())),
            county: Arc::from(Table::new(pool.clone())),
            data: Arc::from(Table::new(pool.clone())),
            dataset: Arc::from(Table::new(pool.clone())),
            map_visualization: Arc::from(Table::new(pool.clone())),
            map_visualization_collection: Arc::from(Table::new(pool.clone())),
            data_category: Arc::from(Table::new(pool.clone())),
            source_and_date: Arc::from(Table::new(pool.clone())),
            data_source: Arc::from(Table::new(pool.clone())),
            color_palette: Arc::from(Table::new(pool.clone())),
            scale_type: Arc::from(Table::new(pool.clone())),
            subcategory: Arc::from(Table::new(pool)),
        }
    }
}
