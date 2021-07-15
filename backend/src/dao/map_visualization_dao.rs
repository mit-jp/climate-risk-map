use super::MapVisualization;
use super::Table;

impl<'c> Table<'c, MapVisualization> {
    pub async fn by_data_category(
        &self,
        data_category: i32,
    ) -> Result<Vec<MapVisualization>, sqlx::Error> {
        sqlx::query_as(
            r#"SELECT
                *
            FROM
                map_visualization_collection,
                map_visualization
            WHERE
                category = $1
                AND id = map_visualization
            ORDER BY
                "order""#,
        )
        .bind(data_category)
        .fetch_all(&*self.pool)
        .await
    }

    pub async fn by_dataset(&self, dataset: i32) -> Result<MapVisualization, sqlx::Error> {
        sqlx::query_as("SELECT * FROM map_visualization WHERE dataset = $1")
            .bind(dataset)
            .fetch_one(&*self.pool)
            .await
    }

    pub async fn by_id(&self, id: i32) -> Result<MapVisualization, sqlx::Error> {
        sqlx::query_as("SELECT * FROM map_visualization WHERE id = $1")
            .bind(id)
            .fetch_one(&*self.pool)
            .await
    }

    pub async fn all(&self) -> Result<Vec<MapVisualization>, sqlx::Error> {
        sqlx::query_as("SELECT * FROM map_visualization")
            .fetch_all(&*self.pool)
            .await
    }
}
