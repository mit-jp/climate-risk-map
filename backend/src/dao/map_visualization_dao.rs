use super::Table;
use super::{MapVisualization, MapVisualizationDaoPatch};
use sqlx::postgres::PgQueryResult;

const SELECT: &str = r#"
SELECT
	map_visualization_collection.category as data_tab,
    map_visualization.id,
    dataset.units,
    dataset.short_name,
    COALESCE(map_visualization."name", dataset."name") as name,
    dataset.description,
    map_visualization.subcategory,
    map_visualization.dataset,
    map_visualization.map_type,
    map_visualization.legend_ticks,
    map_visualization.should_normalize,
    color_palette."name" as color_palette_name,
    color_palette.id as color_palette_id,
    map_visualization.reverse_scale,
    map_visualization.invert_normalized,
    scale_type.name as scale_type_name,
    scale_type.id as scale_type_id,
    map_visualization.formatter_type,
    map_visualization.decimals,
    map_visualization.legend_formatter_type,
    map_visualization.legend_decimals,
    map_visualization.show_pdf,
    map_visualization.default_start_date,
    map_visualization.default_end_date,
    map_visualization.default_source,
    map_visualization_collection.order
"#;

const FROM: &str = r#"
FROM
    map_visualization_collection,
    map_visualization,
    dataset,
    color_palette,
    scale_type
WHERE dataset.id = map_visualization.dataset
AND map_visualization.id = map_visualization_collection.map_visualization
AND map_visualization.color_palette = color_palette.id
AND map_visualization.scale_type = scale_type.id
"#;

impl<'c> Table<'c, MapVisualization> {
    pub async fn all(&self) -> Result<Vec<MapVisualization>, sqlx::Error> {
        sqlx::query_as(&format!("{} {}", SELECT, FROM))
            .fetch_all(&*self.pool)
            .await
    }
    pub async fn get(&self, id: i32) -> Result<MapVisualization, sqlx::Error> {
        sqlx::query_as(&format!(
            "{} {} AND map_visualization.id = $1",
            SELECT, FROM
        ))
        .bind(id)
        .fetch_one(&*self.pool)
        .await
    }
    pub async fn update(
        &self,
        patch: &MapVisualizationDaoPatch,
    ) -> Result<PgQueryResult, sqlx::Error> {
        sqlx::query!(
            "UPDATE map_visualization
            SET dataset = $1,
                map_type = $2,
                subcategory = $3,
                name = $4,
                legend_ticks = $5,
                should_normalize = $6,
                color_palette = $7,
                reverse_scale = $8,
                invert_normalized = $9,
                scale_type = $10,
                show_pdf = $11,
                default_start_date = $12,
                default_end_date = $13,
                default_source = $14,
                formatter_type = $15,
                legend_formatter_type = $16,
                decimals = $17,
                legend_decimals = $18
            WHERE id = $19",
            patch.dataset,
            patch.map_type,
            patch.subcategory,
            patch.name,
            patch.legend_ticks,
            patch.should_normalize,
            patch.color_palette_id,
            patch.reverse_scale,
            patch.invert_normalized,
            patch.scale_type,
            patch.show_pdf,
            patch.default_start_date,
            patch.default_end_date,
            patch.default_source,
            patch.formatter_type,
            patch.legend_formatter_type,
            patch.decimals,
            patch.legend_decimals,
            patch.id,
        )
        .execute(&*self.pool)
        .await
    }
}
