use super::DataSource;
use super::SourceAndDate;
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::collections::HashMap;

#[derive(FromRow, Deserialize, Serialize)]
pub struct MapVisualization {
    pub id: i32,
    pub units: String,
    pub short_name: String,
    pub name: String,
    pub description: String,
    pub subcategory: Option<i32>,
    pub data_tab: i32,
    pub dataset: i32,
    pub map_type: i32,
    pub legend_ticks: Option<i16>,
    pub should_normalize: bool,
    pub color_palette: String,
    pub reverse_scale: bool,
    pub invert_normalized: bool,
    pub scale_type: String,
    pub formatter_type: i32,
    pub decimals: i16,
    pub legend_formatter_type: Option<i32>,
    pub legend_decimals: Option<i16>,
    pub show_pdf: bool,
    pub default_start_date: Option<NaiveDate>,
    pub default_end_date: Option<NaiveDate>,
    pub default_source: Option<i32>,
    pub order: i16,
}

#[derive(Deserialize, Serialize)]
pub struct MapVisualizationModel {
    pub id: i32,
    pub dataset: i32,
    pub map_type: i32,
    pub subcategory: Option<i32>,
    pub data_tab: i32,
    pub units: String,
    pub short_name: String,
    pub name: String,
    pub description: String,
    pub legend_ticks: Option<i16>,
    pub should_normalize: bool,
    pub color_palette: String,
    pub reverse_scale: bool,
    pub invert_normalized: bool,
    pub scale_type: String,
    pub scale_domain: Vec<f64>,
    pub date_ranges_by_source: HashMap<i32, Vec<DateRange>>,
    pub sources: HashMap<i32, DataSource>,
    pub show_pdf: bool,
    pub pdf_domain: Vec<f64>,
    pub default_date_range: Option<DateRange>,
    pub default_source: Option<i32>,
    pub formatter_type: i32,
    pub legend_formatter_type: Option<i32>,
    pub decimals: i16,
    pub legend_decimals: Option<i16>,
    pub order: i16,
}

impl MapVisualizationModel {
    pub fn new(
        map_visualization: MapVisualization,
        source_and_dates: Vec<SourceAndDate>,
        data_sources: Vec<DataSource>,
        pdf_domain: Vec<f64>,
        scale_domain: Vec<f64>,
    ) -> MapVisualizationModel {
        let mut date_ranges_by_source = HashMap::new();
        for source_and_date in source_and_dates {
            let date_range = DateRange::from(&source_and_date);
            let dates = date_ranges_by_source
                .entry(source_and_date.source)
                .or_insert_with(Vec::new);
            dates.push(date_range);
        }
        let default_date_range = match (
            map_visualization.default_start_date,
            map_visualization.default_end_date,
        ) {
            (Some(start_date), Some(end_date)) => Option::Some(DateRange {
                start_date,
                end_date,
            }),
            _ => Option::None,
        };
        MapVisualizationModel {
            id: map_visualization.id,
            dataset: map_visualization.dataset,
            map_type: map_visualization.map_type,
            subcategory: map_visualization.subcategory,
            data_tab: map_visualization.data_tab,
            units: map_visualization.units,
            short_name: map_visualization.short_name,
            name: map_visualization.name,
            description: map_visualization.description,
            legend_ticks: map_visualization.legend_ticks,
            should_normalize: map_visualization.should_normalize,
            color_palette: map_visualization.color_palette,
            reverse_scale: map_visualization.reverse_scale,
            invert_normalized: map_visualization.invert_normalized,
            scale_type: map_visualization.scale_type,
            scale_domain,
            date_ranges_by_source,
            sources: data_sources
                .into_iter()
                .map(|data_source| (data_source.id, data_source))
                .collect::<HashMap<i32, DataSource>>(),
            show_pdf: map_visualization.show_pdf,
            pdf_domain,
            default_date_range,
            default_source: map_visualization.default_source,
            formatter_type: map_visualization.formatter_type,
            legend_formatter_type: map_visualization.legend_formatter_type,
            decimals: map_visualization.decimals,
            legend_decimals: map_visualization.legend_decimals,
            order: map_visualization.order,
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
