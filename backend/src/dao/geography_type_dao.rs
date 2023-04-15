use crate::model::GeographyType;

use super::database::Table;

impl Table<'_, GeographyType> {
    pub async fn all(&self) -> Result<Vec<GeographyType>, sqlx::Error> {
        sqlx::query_as!(GeographyType, "SELECT * FROM geography_type")
            .fetch_all(&*self.pool)
            .await
    }
}
