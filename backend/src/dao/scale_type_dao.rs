use super::ScaleType;
use super::Table;

impl<'c> Table<'c, ScaleType> {
    pub async fn all(&self) -> Result<Vec<ScaleType>, sqlx::Error> {
        sqlx::query_as("SELECT id, name FROM scale_type")
            .fetch_all(&*self.pool)
            .await
    }
}
