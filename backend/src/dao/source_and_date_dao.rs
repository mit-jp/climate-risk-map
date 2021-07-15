use super::SourceAndDate;
use super::Table;

impl<'c> Table<'c, SourceAndDate> {
    pub async fn by_dataset(&self, dataset: i32) -> Result<Vec<SourceAndDate>, sqlx::Error> {
        sqlx::query_as(
            "SELECT DISTINCT source, start_date, end_date FROM county_data WHERE dataset = $1",
        )
        .bind(dataset)
        .fetch_all(&*self.pool)
        .await
    }
}
