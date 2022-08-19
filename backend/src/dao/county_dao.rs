use super::County;
use super::Table;

impl<'c> Table<'c, County> {
    pub async fn by_id(&self, id: i16) -> Result<Vec<County>, sqlx::Error> {
        sqlx::query_as!(
            County,
            "SELECT id, name, state FROM usa_county WHERE id = $1",
            id
        )
        .fetch_all(&*self.pool)
        .await
    }

    pub async fn all(&self) -> Result<Vec<County>, sqlx::Error> {
        sqlx::query_as!(
            County,
            "SELECT id, name, state FROM usa_county ORDER BY state"
        )
        .fetch_all(&*self.pool)
        .await
    }
}
