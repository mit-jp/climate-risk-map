use sqlx::postgres::PgQueryResult;

use super::Dataset;
use super::Table;

impl<'c> Table<'c, Dataset> {
    pub async fn update(&self, dataset: &Dataset) -> Result<PgQueryResult, sqlx::Error> {
        sqlx::query!(
            r#"
            UPDATE "dataset"
            SET "short_name" = $1, "name" = $2, "description" = $3, "units" = $4
            WHERE "id" = $5"#,
            dataset.short_name,
            dataset.name,
            dataset.description,
            dataset.units,
            dataset.id
        )
        .execute(&*self.pool)
        .await
    }

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
            "SELECT id, short_name, name, description, units FROM dataset ORDER BY id"
        )
        .fetch_all(&*self.pool)
        .await
    }
}
