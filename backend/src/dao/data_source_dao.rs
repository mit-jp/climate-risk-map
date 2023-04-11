use sqlx::postgres::PgQueryResult;

use crate::model::DataSourceDiff;

use super::DataSource;
use super::Table;

impl<'c> Table<'c, DataSource> {
    pub async fn by_dataset(&self, id: i32) -> Result<Vec<DataSource>, sqlx::Error> {
        return sqlx::query_as!(
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
        .await;
    }

    pub async fn all(&self) -> Result<Vec<DataSource>, sqlx::Error> {
        return sqlx::query_as!(
            DataSource,
            "
            SELECT id, name, description, link
            FROM data_source
            ORDER BY id
            "
        )
        .fetch_all(&*self.pool)
        .await;
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
