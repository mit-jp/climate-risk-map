use super::State;
use super::Table;

impl<'c> Table<'c, State> {
    pub async fn by_id(&self, id: i16) -> Result<State, sqlx::Error> {
        sqlx::query_as!(
            State,
            r#"
            SELECT "id", "name"
            FROM "usa_state"
            WHERE "id" = $1"#,
            id
        )
        .fetch_one(&*self.pool)
        .await
    }

    pub async fn all(&self) -> Result<Vec<State>, sqlx::Error> {
        sqlx::query_as!(State, "SELECT id, name FROM usa_state")
            .fetch_all(&*self.pool)
            .await
    }
}
