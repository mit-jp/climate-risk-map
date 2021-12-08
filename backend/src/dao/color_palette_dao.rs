use super::ColorPalette;
use super::Table;

impl<'c> Table<'c, ColorPalette> {
    pub async fn all(&self) -> Result<Vec<ColorPalette>, sqlx::Error> {
        sqlx::query_as("SELECT id, name FROM color_palette")
            .fetch_all(&*self.pool)
            .await
    }
}
