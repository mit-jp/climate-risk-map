use sqlx::postgres::PgQueryResult;
use sqlx::query;

use crate::model::map_visualization_collection::{Collection, Id};

use super::Table;

impl<'c> Table<'c, Collection> {
    pub async fn get_last_order(&self, category: i32) -> Result<i16, sqlx::Error> {
        let result = query!(
            "SELECT MAX(\"order\") FROM map_visualization_collection WHERE category = $1",
            category
        )
        .fetch_one(&*self.pool)
        .await?;
        Ok(result.max.unwrap_or(0))
    }

    pub async fn create(&self, collection: Collection) -> Result<PgQueryResult, sqlx::Error> {
        query!(
            "INSERT INTO map_visualization_collection
                (map_visualization, category, \"order\")
                VALUES ($1, $2, $3)",
            collection.map_visualization,
            collection.category,
            collection.order
        )
        .execute(&*self.pool)
        .await
    }

    pub async fn delete(&self, id: Id) -> Result<PgQueryResult, sqlx::Error> {
        query!(
            "DELETE FROM map_visualization_collection
                WHERE map_visualization = $1
                AND category = $2",
            id.map_visualization,
            id.category
        )
        .execute(&*self.pool)
        .await
    }

    pub async fn delete_by_dataset(&self, dataset: i32) -> Result<PgQueryResult, sqlx::Error> {
        sqlx::query!(
            "
            DELETE FROM map_visualization_collection
            USING map_visualization
            WHERE map_visualization_collection.map_visualization = map_visualization.id
            AND map_visualization.dataset = $1
            ",
            dataset
        )
        .execute(&*self.pool)
        .await
    }
}
