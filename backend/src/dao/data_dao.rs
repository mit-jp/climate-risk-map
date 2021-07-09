use super::Data;
use super::Table;

impl<'c> Table<'c, Data> {
    pub async fn by_id(&self, id: i32) -> Result<Vec<Data>, sqlx::Error> {
        sqlx::query_as("SELECT state_id, county_id, source, start_date, end_date, value FROM county_data WHERE dataset = $1")
            .bind(id)
            .fetch_all(&*self.pool)
            .await
    }
}
