use super::County;
use super::Table;

impl<'c> Table<'c, County> {
    pub async fn all(&self) -> Result<Vec<County>, sqlx::Error> {
        sqlx::query_as!(
            County,
            "
            SELECT id, name
            FROM geo_id
            WHERE geography_type = 1
            ORDER BY id
            "
        )
        .fetch_all(&*self.pool)
        .await
    }
}
