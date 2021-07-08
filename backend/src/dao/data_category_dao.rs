use super::DataCategory;
use super::Table;

impl<'c> Table<'c, DataCategory> {
    pub async fn all(&self) -> Result<Vec<DataCategory>, sqlx::Error> {
        sqlx::query_as("SELECT id, name FROM data_category ORDER BY \"order\"")
            .fetch_all(&*self.pool)
            .await
    }
}
