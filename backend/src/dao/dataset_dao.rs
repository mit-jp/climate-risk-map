use super::Dataset;
use super::Table;

impl<'c> Table<'c, Dataset> {
    pub async fn by_id(&self, id: i32) -> Result<Dataset, sqlx::Error> {
        sqlx::query_as!(
            Dataset,
            r#"
            SELECT "id", "short_name", "name", "description", "units"
            FROM "dataset"
            WHERE "id" = $1"#,
            id
        )
        .fetch_one(&*self.pool)
        .await
    }

    pub async fn all(&self) -> Result<Vec<Dataset>, sqlx::Error> {
        sqlx::query_as!(
            Dataset,
            "SELECT id, short_name, name, description, units FROM dataset"
        )
        .fetch_all(&*self.pool)
        .await
    }
}
