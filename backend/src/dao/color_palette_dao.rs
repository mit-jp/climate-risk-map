use super::Table;
use crate::model::color_palette::ColorPalette;

impl<'c> Table<'c, ColorPalette> {
    pub async fn all(&self) -> Result<Vec<ColorPalette>, sqlx::Error> {
        sqlx::query_as!(ColorPalette, "SELECT id, name FROM color_palette")
            .fetch_all(&*self.pool)
            .await
    }
}
