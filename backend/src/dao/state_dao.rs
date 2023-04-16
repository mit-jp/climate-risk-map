use super::Table;
use crate::model::geo_id;

impl<'c> Table<'c, geo_id::State> {
    pub async fn by_id(&self, id: i32) -> Result<geo_id::State, sqlx::Error> {
        sqlx::query_as!(
            geo_id::State,
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

    pub async fn all(&self) -> Result<Vec<geo_id::State>, sqlx::Error> {
        sqlx::query_as!(
            geo_id::State,
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
