use super::DataSource;
use super::SourceAndDate;
use crate::model::ColorPalette;
use crate::model::Dataset;
use crate::model::ScaleType;
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::collections::HashMap;

#[derive(FromRow, Deserialize, Serialize)]
pub struct MapVisualizationDaoPatch {
    pub id: i32,
    pub dataset: i32,
    pub map_type: i32,
    pub subcategory: Option<i32>,
    pub data_tab: Option<i32>,
    pub name: Option<String>,
    pub legend_ticks: Option<i16>,
    pub color_palette_id: i32,
    pub reverse_scale: bool,
    pub invert_normalized: bool,
    pub scale_type: i32,
    pub show_pdf: bool,
    pub default_start_date: Option<NaiveDate>,
    pub default_end_date: Option<NaiveDate>,
    pub default_source: Option<i32>,
    pub formatter_type: i32,
    pub legend_formatter_type: Option<i32>,
    pub decimals: i16,
    pub legend_decimals: Option<i16>,
    pub color_domain: Vec<f64>,
    pub pdf_domain: Vec<f64>,
}

impl MapVisualizationDaoPatch {
    pub fn new(patch: MapVisualizationPatch) -> MapVisualizationDaoPatch {
        MapVisualizationDaoPatch {
            id: patch.id,
            dataset: patch.dataset,
            map_type: patch.map_type,
            subcategory: patch.subcategory,
            data_tab: patch.data_tab,
            name: patch.name,
            legend_ticks: patch.legend_ticks,
            color_palette_id: patch.color_palette.id,
            reverse_scale: patch.reverse_scale,
            invert_normalized: patch.invert_normalized,
            scale_type: patch.scale_type.id,
            show_pdf: patch.show_pdf,
            default_start_date: patch.default_start_date,
            default_end_date: patch.default_end_date,
            default_source: patch.default_source,
            formatter_type: patch.formatter_type,
            legend_formatter_type: patch.legend_formatter_type,
            decimals: patch.decimals,
            legend_decimals: patch.legend_decimals,
            color_domain: patch.color_domain,
            pdf_domain: patch.pdf_domain,
        }
    }
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct MapVisualizationPatch {
    pub id: i32,
    pub dataset: i32,
    pub map_type: i32,
    pub subcategory: Option<i32>,
    pub data_tab: Option<i32>,
    pub name: Option<String>,
    pub legend_ticks: Option<i16>,
    pub color_palette: ColorPalette,
    pub reverse_scale: bool,
    pub invert_normalized: bool,
    pub scale_type: ScaleType,
    pub color_domain: Vec<f64>,
    pub show_pdf: bool,
    pub pdf_domain: Vec<f64>,
    pub default_start_date: Option<NaiveDate>,
    pub default_end_date: Option<NaiveDate>,
    pub default_source: Option<i32>,
    pub formatter_type: i32,
    pub legend_formatter_type: Option<i32>,
    pub decimals: i16,
    pub legend_decimals: Option<i16>,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct MapVisualization {
    pub id: i32,
    pub units: String,
    pub short_name: String,
    pub dataset_name: String,
    pub name: Option<String>,
    pub description: String,
    pub subcategory: Option<i32>,
    pub data_tab: Option<i32>,
    pub dataset: i32,
    pub map_type: i32,
    pub legend_ticks: Option<i16>,
    pub color_palette_name: String,
    pub color_palette_id: i32,
    pub reverse_scale: bool,
    pub invert_normalized: bool,
    pub scale_type_id: i32,
    pub scale_type_name: String,
    pub formatter_type: i32,
    pub decimals: i16,
    pub legend_formatter_type: Option<i32>,
    pub legend_decimals: Option<i16>,
    pub show_pdf: bool,
    pub default_start_date: Option<NaiveDate>,
    pub default_end_date: Option<NaiveDate>,
    pub default_source: Option<i32>,
    pub order: i16,
    pub color_domain: Vec<f64>,
    pub pdf_domain: Vec<f64>,
}

#[derive(Deserialize, Serialize)]
pub struct MapVisualizationModel {
    pub id: i32,
    pub dataset: i32,
    pub map_type: i32,
    pub subcategory: Option<i32>,
    pub data_tab: Option<i32>,
    pub units: String,
    pub short_name: String,
    pub name: Option<String>,
    pub dataset_name: String,
    pub description: String,
    pub legend_ticks: Option<i16>,
    pub color_palette: ColorPalette,
    pub reverse_scale: bool,
    pub invert_normalized: bool,
    pub scale_type: ScaleType,
    pub color_domain: Vec<f64>,
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
        dataset: Dataset,
        source_and_dates: Vec<SourceAndDate>,
        data_sources: Vec<DataSource>,
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
            dataset_name: map_visualization.dataset_name,
            name: map_visualization.name,
            description: map_visualization.description,
            legend_ticks: map_visualization.legend_ticks,
            color_palette: ColorPalette {
                name: map_visualization.color_palette_name,
                id: map_visualization.color_palette_id,
            },
            reverse_scale: map_visualization.reverse_scale,
            invert_normalized: map_visualization.invert_normalized,
            scale_type: ScaleType {
                id: map_visualization.scale_type_id,
                name: map_visualization.scale_type_name,
            },
            color_domain: map_visualization.color_domain,
            date_ranges_by_source,
            sources: data_sources
                .into_iter()
                .map(|data_source| (data_source.id, data_source))
                .collect::<HashMap<i32, DataSource>>(),
            show_pdf: map_visualization.show_pdf,
            pdf_domain: map_visualization.pdf_domain,
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

#[derive(FromRow, Deserialize, Serialize, PartialEq, Debug)]
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_converts_dates_to_range() {
        let map_visualization: MapVisualization = MapVisualization {
            id: 1,
            units: "".to_string(),
            short_name: "".to_string(),
            dataset_name: "".to_string(),
            name: None,
            description: "".to_string(),
            subcategory: None,
            data_tab: Some(1),
            dataset: 1,
            map_type: 1,
            legend_ticks: None,
            color_palette_name: "".to_string(),
            color_palette_id: 1,
            reverse_scale: false,
            invert_normalized: false,
            scale_type_id: 1,
            scale_type_name: "".to_string(),
            formatter_type: 1,
            decimals: 1,
            legend_formatter_type: None,
            legend_decimals: None,
            show_pdf: false,
            default_start_date: None,
            default_end_date: None,
            default_source: None,
            order: 1,
            color_domain: vec![],
            pdf_domain: vec![],
        };
        let source_id = 1;
        let dataset = Dataset {
            id: 1,
            name: "".to_string(),
            description: "".to_string(),
            short_name: "".to_string(),
            units: "".to_string(),
        };
        let source: DataSource = DataSource {
            id: source_id,
            name: "".to_string(),
            description: "".to_string(),
            link: "".to_string(),
        };
        let source_and_date: SourceAndDate = SourceAndDate {
            source: source.id,
            start_date: NaiveDate::from_ymd(2019, 1, 1),
            end_date: NaiveDate::from_ymd(2020, 1, 1),
        };
        let expected_date_range = DateRange::from(&source_and_date);
        let map_visualization_model = MapVisualizationModel::new(
            map_visualization,
            dataset,
            vec![source_and_date],
            vec![source],
        );

        assert_eq!(
            map_visualization_model.date_ranges_by_source[&source_id][0],
            expected_date_range
        );
    }
}
