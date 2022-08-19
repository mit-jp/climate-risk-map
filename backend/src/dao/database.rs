use super::{
    ColorPalette, CountryData, County, DataCategory, DataSource, Dataset, MapVisualization,
    ScaleType, SourceAndDate, State, USACountyData,
};
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
    pub usa_county_data: Arc<Table<'c, USACountyData>>,
    pub country_data: Arc<Table<'c, CountryData>>,
    pub dataset: Arc<Table<'c, Dataset>>,
    pub map_visualization: Arc<Table<'c, MapVisualization>>,
    pub data_category: Arc<Table<'c, DataCategory>>,
    pub source_and_date: Arc<Table<'c, SourceAndDate>>,
    pub data_source: Arc<Table<'c, DataSource>>,
    pub color_palette: Arc<Table<'c, ColorPalette>>,
    pub scale_type: Arc<Table<'c, ScaleType>>,
}

impl Database<'_> {
    pub async fn new(sql_url: &str) -> Database<'_> {
        let pool = PgPool::connect(sql_url).await.unwrap();
        let pool = Arc::new(pool);

        Database {
            state: Arc::from(Table::new(pool.clone())),
            county: Arc::from(Table::new(pool.clone())),
            usa_county_data: Arc::from(Table::new(pool.clone())),
            country_data: Arc::from(Table::new(pool.clone())),
            dataset: Arc::from(Table::new(pool.clone())),
            map_visualization: Arc::from(Table::new(pool.clone())),
            data_category: Arc::from(Table::new(pool.clone())),
            source_and_date: Arc::from(Table::new(pool.clone())),
            data_source: Arc::from(Table::new(pool.clone())),
            color_palette: Arc::from(Table::new(pool.clone())),
            scale_type: Arc::from(Table::new(pool)),
        }
    }
}
