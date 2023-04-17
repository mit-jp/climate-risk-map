use crate::model::geography_type::Type;

use super::database::Table;

impl Table<'_, Type> {
    pub async fn all(&self) -> Result<Vec<Type>, sqlx::Error> {
        sqlx::query_as!(Type, "SELECT * FROM geography_type")
            .fetch_all(&*self.pool)
            .await
    }
}
