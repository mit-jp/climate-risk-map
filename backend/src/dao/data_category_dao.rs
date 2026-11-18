use super::Table;
use crate::model::data_category::DataCategory;
use sqlx::postgres::PgQueryResult;

impl<'c> Table<'c, DataCategory> {
    pub async fn all(&self) -> Result<Vec<DataCategory>, sqlx::Error> {
        sqlx::query_as!(
            DataCategory,
            "SELECT id, name, normalized, \"order\" FROM data_category ORDER BY \"order\""
        )
        .fetch_all(&*self.pool)
        .await
    }

    pub async fn create(&self, data_category: &DataCategory) -> Result<DataCategory, sqlx::Error> {
        sqlx::query_as!(
            DataCategory,
            "INSERT INTO data_category (name, normalized, \"order\") VALUES ($1, $2, $3) RETURNING id, name, normalized, \"order\"",
            data_category.name,
            data_category.normalized,
            data_category.order
        )
        .fetch_one(&*self.pool)
        .await
    }

    pub async fn update(&self, data_category: &DataCategory) -> Result<PgQueryResult, sqlx::Error> {
        sqlx::query!(
            "UPDATE data_category SET name = $1, normalized = $2, \"order\" = $3 WHERE id = $4",
            data_category.name,
            data_category.normalized,
            data_category.order,
            data_category.id
        )
        .execute(&*self.pool)
        .await
    }

    pub async fn delete(&self, id: i32) -> Result<PgQueryResult, sqlx::Error> {
        let mut transaction = self.pool.begin().await?;
        // Unpublish the category's map visualizations (the visualizations themselves are kept)
        sqlx::query!(
            "DELETE FROM map_visualization_collection WHERE category = $1",
            id
        )
        .execute(&mut transaction)
        .await?;
        let result = sqlx::query!("DELETE FROM data_category WHERE id = $1", id)
            .execute(&mut transaction)
            .await?;
        transaction.commit().await?;
        Ok(result)
    }

    pub async fn last_order(&self) -> Result<i16, sqlx::Error> {
        sqlx::query!("SELECT \"order\" FROM data_category ORDER BY \"order\" DESC LIMIT 1")
            .fetch_one(&*self.pool)
            .await
            .map(|r| r.order)
    }
}
