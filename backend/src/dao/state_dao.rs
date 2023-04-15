use super::State;
use super::Table;

impl<'c> Table<'c, State> {
    pub async fn by_id(&self, id: i32) -> Result<State, sqlx::Error> {
        sqlx::query_as!(
            State,
            "
            SELECT id, name
            FROM geo_id
            WHERE geography_type = 3
            AND id = $1
            ",
            id
        )
        .fetch_one(&*self.pool)
        .await
    }

    pub async fn all(&self) -> Result<Vec<State>, sqlx::Error> {
        sqlx::query_as!(
            State,
            "
            SELECT id, name
            FROM geo_id
            WHERE geography_type = 3
            ORDER BY id
            "
        )
        .fetch_all(&*self.pool)
        .await
    }
}
