use super::MapVisualization;
use super::Table;

const SELECT: &str = r#"
SELECT
    map_visualization.id,
    dataset.units,
    dataset.short_name,
    dataset."name",
    dataset.description,
    map_visualization.subcategory,
    map_visualization.dataset,
    map_visualization.map_type,
    map_visualization.legend_ticks,
    map_visualization.should_normalize,
    color_palette."name" as color_palette,
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
    map_visualization.default_source
"#;

const FROM: &str = r#"
FROM
    map_visualization,
    dataset,
    color_palette,
    scale_type
WHERE
    dataset.id = map_visualization.dataset
    AND map_visualization.color_palette = color_palette.id
    AND map_visualization.scale_type = scale_type.id
"#;

impl<'c> Table<'c, MapVisualization> {
    pub async fn by_data_category(
        &self,
        data_category: i32,
    ) -> Result<Vec<MapVisualization>, sqlx::Error> {
        sqlx::query_as(&format!(
            r#"{}
            FROM
                map_visualization_collection,
                map_visualization,
                dataset,
                color_palette,
                scale_type
            WHERE
                category = $1
                AND map_visualization.id = map_visualization_collection.map_visualization
                AND dataset.id = map_visualization.dataset
                AND map_visualization.color_palette = color_palette.id
                AND map_visualization.scale_type = scale_type.id
            ORDER BY
                map_visualization_collection."order"
                "#,
            SELECT
        ))
        .bind(data_category)
        .fetch_all(&*self.pool)
        .await
    }

    pub async fn by_dataset(&self, dataset: i32) -> Result<MapVisualization, sqlx::Error> {
        sqlx::query_as(&format!(
            "{} {}
            AND map_visualization.dataset = $1",
            SELECT, FROM,
        ))
        .bind(dataset)
        .fetch_one(&*self.pool)
        .await
    }

    pub async fn by_id(&self, id: i32) -> Result<MapVisualization, sqlx::Error> {
        sqlx::query_as(&format!(
            "{}
            FROM map_visualization, dataset
            WHERE id = $1
            AND map_visualization.dataset = dataset.id",
            SELECT,
        ))
        .bind(id)
        .fetch_one(&*self.pool)
        .await
    }

    pub async fn all(&self) -> Result<Vec<MapVisualization>, sqlx::Error> {
        sqlx::query_as(&format!(
            "{}
            FROM map_visualization, dataset
            WHERE map_visualization.dataset = dataset.id",
            SELECT
        ))
        .fetch_all(&*self.pool)
        .await
    }
}
