use sqlx::postgres::PgQueryResult;

use crate::model::DataSourceDiff;

use super::DataSource;
use super::Table;
use crate::model::NewDataSource;

impl<'c> Table<'c, DataSource> {
    pub async fn all(&self) -> Result<Vec<DataSource>, sqlx::Error> {
        sqlx::query_as!(DataSource, "SELECT * FROM data_source ORDER BY id")
            .fetch_all(&*self.pool)
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

    pub async fn create(&self, data_source: &NewDataSource) -> Result<i32, sqlx::Error> {
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

    pub async fn update(&self, data_source: &DataSourceDiff) -> Result<PgQueryResult, sqlx::Error> {
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
}
