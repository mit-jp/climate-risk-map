use crate::model::subcategory::Subcategory;

use super::Table;

impl<'c> Table<'c, Subcategory> {
    pub async fn all(&self) -> Result<Vec<Subcategory>, sqlx::Error> {
        sqlx::query_as!(
            Subcategory,
            "SELECT id, name FROM subcategory ORDER BY \"order\" ASC"
        )
        .fetch_all(&*self.pool)
        .await
    }
}
