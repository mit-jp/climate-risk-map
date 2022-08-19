use super::DataSource;
use super::Table;

impl<'c> Table<'c, DataSource> {
    pub async fn by_dataset(&self, id: i32) -> Result<Vec<DataSource>, sqlx::Error> {
        return sqlx::query_as!(
            DataSource,
            "
            SELECT DISTINCT source as id, name, description, link
            FROM usa_county_data, data_source
            WHERE dataset = $1
            AND data_source.id = usa_county_data.source
            ",
            id
        )
        .fetch_all(&*self.pool)
        .await;
    }
}
