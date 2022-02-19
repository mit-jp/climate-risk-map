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
    map_visualization_collection.order,
    map_visualization.color_domain,
    map_visualization.pdf_domain
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
                color_palette = $6,
                reverse_scale = $7,
                invert_normalized = $8,
                scale_type = $9,
                show_pdf = $10,
                default_start_date = $11,
                default_end_date = $12,
                default_source = $13,
                formatter_type = $14,
                legend_formatter_type = $15,
                decimals = $16,
                legend_decimals = $17,
                color_domain = $18,
                pdf_domain = $19
            WHERE id = $20",
            patch.dataset,
            patch.map_type,
            patch.subcategory,
            patch.name,
            patch.legend_ticks,
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
            &patch.color_domain,
            &patch.pdf_domain,
            patch.id,
        )
        .execute(&*self.pool)
        .await
    }
    pub async fn create(
        &self,
        map: &MapVisualizationDaoPatch,
    ) -> Result<PgQueryResult, sqlx::Error> {
        sqlx::query!(
            "INSERT INTO map_visualization (
                dataset,
                map_type,
                subcategory,
                name,
                legend_ticks,
                color_palette,
                reverse_scale,
                invert_normalized,
                scale_type,
                show_pdf,
                default_start_date,
                default_end_date,
                default_source,
                formatter_type,
                legend_formatter_type,
                decimals,
                legend_decimals,
                color_domain,
                pdf_domain)
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10,
                $11,
                $12,
                $13,
                $14,
                $15,
                $16,
                $17,
                $18,
                $19)",
            map.dataset,
            map.map_type,
            map.subcategory,
            map.name,
            map.legend_ticks,
            map.color_palette_id,
            map.reverse_scale,
            map.invert_normalized,
            map.scale_type,
            map.show_pdf,
            map.default_start_date,
            map.default_end_date,
            map.default_source,
            map.formatter_type,
            map.legend_formatter_type,
            map.decimals,
            map.legend_decimals,
            &map.color_domain,
            &map.pdf_domain,
        )
        .execute(&*self.pool)
        .await
    }
}
