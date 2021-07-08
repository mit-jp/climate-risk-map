use super::MapVisualization;
use super::Table;

impl<'c> Table<'c, MapVisualization> {
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
