use super::Domain;
use super::Table;

impl<'c> Table<'c, Domain> {
    pub async fn scale(&self, id: i32) -> Result<Vec<Domain>, sqlx::Error> {
        sqlx::query_as("SELECT value FROM scale_domain WHERE map_visualization = $1")
            .bind(id)
            .fetch_all(&*self.pool)
            .await
    }

    pub async fn pdf(&self, id: i32) -> Result<Vec<Domain>, sqlx::Error> {
        sqlx::query_as("SELECT value FROM pdf_domain WHERE map_visualization = $1")
            .bind(id)
            .fetch_all(&*self.pool)
            .await
    }
}
