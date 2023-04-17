use crate::model::scale_type;

use super::Table;

impl<'c> Table<'c, scale_type::Type> {
    pub async fn all(&self) -> Result<Vec<scale_type::Type>, sqlx::Error> {
        sqlx::query_as!(scale_type::Type, "SELECT id, name FROM scale_type")
            .fetch_all(&*self.pool)
            .await
    }
}
