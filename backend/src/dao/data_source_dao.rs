use super::DataSource;
use super::Table;
use crate::model::GeographyType;

impl<'c> Table<'c, DataSource> {
    pub async fn by_dataset(
        &self,
        id: i32,
        geography_type: &GeographyType,
    ) -> Result<Vec<DataSource>, sqlx::Error> {
        match geography_type {
            GeographyType::Usa => self.by_usa_dataset(id).await,
            GeographyType::World => self.by_world_dataset(id).await,
        }
    }

    async fn by_usa_dataset(&self, id: i32) -> Result<Vec<DataSource>, sqlx::Error> {
        return sqlx::query_as!(
            DataSource,
            "
            SELECT DISTINCT source as id, name, description, link
            FROM usa_county_data, data_source
            WHERE dataset = $1
            AND data_source.id = usa_county_data.source
            ",
            id
        )
        .fetch_all(&*self.pool)
        .await;
    }

    async fn by_world_dataset(&self, id: i32) -> Result<Vec<DataSource>, sqlx::Error> {
        return sqlx::query_as!(
            DataSource,
            "
            SELECT DISTINCT source as id, name, description, link
            FROM country_data, data_source
            WHERE dataset = $1
            AND data_source.id = country_data.source
            ",
            id
        )
        .fetch_all(&*self.pool)
        .await;
    }
}
