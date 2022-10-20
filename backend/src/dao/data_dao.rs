use crate::model::DataWithDataset;

use super::Data;
use super::SimpleData;
use super::SourceAndDate;
use super::Table;

impl<'c> Table<'c, Data> {
    pub async fn by_id(&self, id: i32) -> Result<Vec<Data>, sqlx::Error> {
        sqlx::query_as("SELECT state_id, county_id, source, start_date, end_date, value FROM county_data WHERE dataset = $1")
            .bind(id)
            .fetch_all(&*self.pool)
            .await
    }
    pub async fn by_data_category(
        &self,
        data_category: i32,
    ) -> Result<Vec<DataWithDataset>, sqlx::Error> {
        sqlx::query_as!(
            DataWithDataset,
            "SELECT
                state_id,
                county_id,
                source,
                start_date,
                end_date,
                value,
                county_data.dataset
            FROM county_data, map_visualization, map_visualization_collection
            WHERE
                county_data.dataset = map_visualization.dataset
                AND map_visualization.id = map_visualization_collection.map_visualization
                AND map_visualization_collection.category = $1",
            data_category
        )
        .fetch_all(&*self.pool)
        .await
    }
    pub async fn by_id_source_date(
        &self,
        id: i32,
        source_and_date: SourceAndDate,
    ) -> Result<Vec<SimpleData>, sqlx::Error> {
        sqlx::query_as(
            "
            SELECT
                state_id, county_id, value
            FROM county_data
            WHERE dataset = $1
            AND source = $2
            AND start_date = $3
            AND end_date = $4
            ",
        )
        .bind(id)
        .bind(source_and_date.source)
        .bind(source_and_date.start_date)
        .bind(source_and_date.end_date)
        .fetch_all(&*self.pool)
        .await
    }
}
