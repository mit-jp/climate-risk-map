use super::SourceAndDate;
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::collections::HashMap;

#[derive(FromRow, Deserialize, Serialize)]
pub struct MapVisualization {
    pub id: i32,
    pub dataset: i32,
    pub map_type: i16,
    pub legend_ticks: Option<i16>,
    pub should_normalize: bool,
    pub color_palette: i16,
    pub reverse_scale: bool,
    pub invert_normalized: bool,
    pub scale_type: i16,
    pub formatter_type: i16,
    pub decimals: i16,
    pub legend_formatter_type: Option<i16>,
    pub legend_decimals: Option<i16>,
}

#[derive(Deserialize, Serialize)]
pub struct MapVisualizationModel {
    pub id: i32,
    pub dataset: i32,
    pub map_type: i16,
    pub legend_ticks: Option<i16>,
    pub should_normalize: bool,
    pub color_palette: i16,
    pub reverse_scale: bool,
    pub invert_normalized: bool,
    pub scale_type: i16,
    pub formatter_type: i16,
    pub decimals: i16,
    pub legend_formatter_type: Option<i16>,
    pub legend_decimals: Option<i16>,
    pub sources: HashMap<i16, Vec<DateRange>>,
}

impl MapVisualizationModel {
    pub fn new(
        map_visualization: MapVisualization,
        source_and_dates: Vec<SourceAndDate>,
    ) -> MapVisualizationModel {
        let mut source_to_dates = HashMap::new();
        for source_and_date in source_and_dates {
            let date_range = DateRange::from(&source_and_date);
            let dates = source_to_dates
                .entry(source_and_date.source)
                .or_insert_with(Vec::new);
            dates.push(date_range);
        }
        MapVisualizationModel {
            id: map_visualization.id,
            dataset: map_visualization.dataset,
            map_type: map_visualization.map_type,
            legend_ticks: map_visualization.legend_ticks,
            should_normalize: map_visualization.should_normalize,
            color_palette: map_visualization.color_palette,
            reverse_scale: map_visualization.reverse_scale,
            invert_normalized: map_visualization.invert_normalized,
            scale_type: map_visualization.scale_type,
            formatter_type: map_visualization.formatter_type,
            decimals: map_visualization.decimals,
            legend_formatter_type: map_visualization.legend_formatter_type,
            legend_decimals: map_visualization.legend_decimals,
            sources: source_to_dates,
        }
    }
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct DateRange {
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
}

impl DateRange {
    pub fn from(source_and_date: &SourceAndDate) -> DateRange {
        DateRange {
            start_date: source_and_date.start_date,
            end_date: source_and_date.end_date,
        }
    }
}
