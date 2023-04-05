use crate::model::GeographyType;

use super::SourceAndDate;
use super::Table;

impl<'c> Table<'c, SourceAndDate> {
    pub async fn by_dataset(
        &self,
        dataset: i32,
        geography_type: &GeographyType,
    ) -> Result<Vec<SourceAndDate>, sqlx::Error> {
        match geography_type {
            GeographyType::Usa => self.by_usa_dataset(dataset).await,
            GeographyType::World => self.by_world_dataset(dataset).await,
        }
    }
    async fn by_usa_dataset(&self, dataset: i32) -> Result<Vec<SourceAndDate>, sqlx::Error> {
        sqlx::query_as!(
            SourceAndDate,
            r#"
            SELECT DISTINCT source, start_date, end_date
            FROM usa_county_data
            WHERE dataset = $1
            "#,
            dataset
        )
        .fetch_all(&*self.pool)
        .await
    }

    async fn by_world_dataset(&self, dataset: i32) -> Result<Vec<SourceAndDate>, sqlx::Error> {
        sqlx::query_as!(
            SourceAndDate,
            r#"
            SELECT DISTINCT source, start_date, end_date
            FROM country_data
            WHERE dataset = $1
            "#,
            dataset
        )
        .fetch_all(&*self.pool)
        .await
    }
}
