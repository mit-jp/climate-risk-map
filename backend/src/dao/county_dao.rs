use super::County;
use super::Table;

impl<'c> Table<'c, County> {
    pub async fn all(&self) -> Result<Vec<County>, sqlx::Error> {
        sqlx::query_as!(
            County,
            "SELECT id, name, state FROM usa_county ORDER BY state"
        )
        .fetch_all(&*self.pool)
        .await
    }
}
