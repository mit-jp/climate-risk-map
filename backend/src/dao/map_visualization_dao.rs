use super::MapVisualization;
use super::Table;

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
    scale_type.name as scale_type,
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
}
