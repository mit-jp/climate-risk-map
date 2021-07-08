use super::State;
use super::Table;

impl<'c> Table<'c, State> {
    pub async fn by_id(&self, id: i16) -> Result<State, sqlx::Error> {
        sqlx::query_as(
            r#"
            SELECT "id", "name"
            FROM "state"
            WHERE "id" = $1"#,
        )
        .bind(id)
        .fetch_one(&*self.pool)
        .await
    }

    pub async fn all(&self) -> Result<Vec<State>, sqlx::Error> {
        sqlx::query_as("SELECT id, name FROM state")
            .fetch_all(&*self.pool)
            .await
    }
}
