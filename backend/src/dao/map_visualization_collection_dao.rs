use sqlx::postgres::PgQueryResult;
use sqlx::query;

use crate::model::MapVisualizationCollection;
use crate::model::MapVisualizationCollectionId;

use super::Table;

impl<'c> Table<'c, MapVisualizationCollection> {
    pub async fn get_last_order(&self, category: i32) -> Result<i16, sqlx::Error> {
        let result = query!(
            "SELECT MAX(\"order\") FROM map_visualization_collection WHERE category = $1",
            category
        )
        .fetch_one(&*self.pool)
        .await?;
        Ok(result.max.unwrap_or(0))
    }

    pub async fn create(
        &self,
        info: MapVisualizationCollection,
    ) -> Result<PgQueryResult, sqlx::Error> {
        query!(
            "INSERT INTO map_visualization_collection
                (map_visualization, category, \"order\")
                VALUES ($1, $2, $3)",
            info.map_visualization,
            info.category,
            info.order
        )
        .execute(&*self.pool)
        .await
    }

    pub async fn delete(
        &self,
        info: MapVisualizationCollectionId,
    ) -> Result<PgQueryResult, sqlx::Error> {
        query!(
            "DELETE FROM map_visualization_collection
                WHERE map_visualization = $1
                AND category = $2",
            info.map_visualization,
            info.category
        )
        .execute(&*self.pool)
        .await
    }
}
