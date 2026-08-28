use super::Table;
use crate::model::data_source::{self, DataSource};
use sqlx::postgres::PgQueryResult;
use sqlx::{Acquire, Postgres};

impl<'c> Table<'c, DataSource> {
    pub async fn all(&self) -> Result<Vec<DataSource>, sqlx::Error> {
        sqlx::query_as!(DataSource, "SELECT * FROM data_source ORDER BY id")
            .fetch_all(&*self.pool)
            .await
    }

    pub async fn by_name(&self, name: &str) -> Result<Option<DataSource>, sqlx::Error> {
        sqlx::query_as!(
            DataSource,
            "SELECT * FROM data_source WHERE name = $1",
            name
        )
        .fetch_optional(&*self.pool)
        .await
    }

    pub async fn by_dataset(&self, id: i32) -> Result<Vec<DataSource>, sqlx::Error> {
        sqlx::query_as!(
            DataSource,
            "
            SELECT DISTINCT source as id, name, description, link
            FROM data, data_source
            WHERE dataset = $1
            AND data_source.id = data.source
            ",
            id
        )
        .fetch_all(&*self.pool)
        .await
    }

    pub async fn create(&self, data_source: &data_source::Creator) -> Result<i32, sqlx::Error> {
        sqlx::query!(
            "
            INSERT INTO data_source (name, description, link)
            VALUES ($1, $2, $3)
            RETURNING id
            ",
            data_source.name,
            data_source.description,
            data_source.link,
        )
        .fetch_one(&*self.pool)
        .await
        .map(|row| row.id)
    }

    pub async fn update(
        &self,
        data_source: &data_source::Diff,
    ) -> Result<PgQueryResult, sqlx::Error> {
        return sqlx::query!(
            "
            UPDATE data_source
            SET name = COALESCE($1, name),
                description = COALESCE($2, description),
                link = COALESCE($3, link)
            WHERE id = $4
            ",
            data_source.name,
            data_source.description,
            data_source.link,
            data_source.id
        )
        .execute(&*self.pool)
        .await;
    }

    pub async fn delete_cascading(&self, id: i32) -> Result<(), sqlx::Error> {
        self.delete_cascading_in(&*self.pool, id).await
    }

    /// Runs inside `conn`: a pool gets its own transaction, an open
    /// transaction nests via savepoint and the caller decides the final commit.
    pub async fn delete_cascading_in<'a, A>(&self, conn: A, id: i32) -> Result<(), sqlx::Error>
    where
        A: Acquire<'a, Database = Postgres>,
    {
        let mut transaction = conn.begin().await?;
        sqlx::query!(
            "UPDATE map_visualization SET default_source = NULL WHERE default_source = $1",
            id
        )
        .execute(&mut transaction)
        .await?;
        sqlx::query!("DELETE FROM data WHERE source = $1", id)
            .execute(&mut transaction)
            .await?;
        sqlx::query!("DELETE FROM data_source WHERE id = $1", id)
            .execute(&mut transaction)
            .await?;
        transaction.commit().await
    }
}
