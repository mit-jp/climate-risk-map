use super::Table;
use super::{MapVisualization, MapVisualizationDaoPatch};
use sqlx::postgres::PgQueryResult;

macro_rules! select {
    () => {
        select!("JOIN", ,)
    };
    (include_drafts) => {
        select!("LEFT JOIN", ,)
    };
    (geography_type=$geography_type:expr) => {
        select!("JOIN", geography_type=$geography_type,)
    };
    (geography_type=$geography_type:expr, include_drafts) => {
        select!("LEFT JOIN", geography_type=$geography_type,)
    };
    ($id:ident) => {
        select!("LEFT JOIN", ,$id)
    };
    ($join_type:expr, $(geography_type=$geography_type:expr)?, $($id:expr)?) => {
        sqlx::query_as!(
            MapVisualization,
            r#"
            SELECT
                map.id as "id!",
                map.reverse_scale as "reverse_scale!",
                map.invert_normalized as "invert_normalized!",
                map.subcategory,
                map.dataset as "dataset!",
                map.map_type as "map_type!",
                map.legend_ticks,
                map.formatter_type as "formatter_type!",
                map.decimals as "decimals!",
                map.legend_formatter_type,
                map.legend_decimals,
                map.show_pdf as "show_pdf!",
                map.default_start_date,
                map.default_end_date,
                map.default_source,
                map.color_domain as "color_domain!",
                array_sort(map.pdf_domain) as "pdf_domain!",
                map."name",
                dataset.geography_type as "geography_type!",
                map.bubble_color as "bubble_color!",
                
                dataset."name" as "dataset_name!",
                dataset.units as "units!",
                dataset.short_name as "short_name!",
                dataset.description as "description!",
                
                color_palette."name" as "color_palette_name!",
                color_palette.id as "color_palette_id!",

                scale_type.name as "scale_type_name!",
                scale_type.id as "scale_type_id!",
                
                map_visualization_collection.category as "data_tab?",
                COALESCE(map_visualization_collection.order, int2(0)) as "order!"
                FROM map_visualization AS map
                INNER JOIN dataset ON map.dataset = dataset.id
                INNER JOIN color_palette ON map.color_palette = color_palette.id
                INNER JOIN scale_type ON map.scale_type = scale_type.id
            "#
            + $join_type
            + " map_visualization_collection ON map.id = map_visualization_collection.map_visualization"
            $( + " WHERE dataset.geography_type = $1", $geography_type)?
            $( + " WHERE map.id = $1", $id)?
        )
    };
}

impl<'c> Table<'c, MapVisualization> {
    pub async fn all(
        &self,
        include_drafts: bool,
        geography_type: Option<i32>,
    ) -> Result<Vec<MapVisualization>, sqlx::Error> {
        if geography_type.is_none() && include_drafts {
            select!(include_drafts).fetch_all(&*self.pool).await
        } else if geography_type.is_none() {
            select!().fetch_all(&*self.pool).await
        } else if include_drafts {
            select!(geography_type = geography_type, include_drafts)
                .fetch_all(&*self.pool)
                .await
        } else {
            select!(geography_type = geography_type)
                .fetch_all(&*self.pool)
                .await
        }
    }
    pub async fn get(&self, id: i32) -> Result<MapVisualization, sqlx::Error> {
        select!(id).fetch_one(&*self.pool).await
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
                pdf_domain = $19,
                bubble_color = $20
            WHERE id = $21",
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
            patch.bubble_color,
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
                pdf_domain,
                bubble_color
            )
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
                $19,
                $20)",
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
            map.bubble_color,
        )
        .execute(&*self.pool)
        .await
    }
}
