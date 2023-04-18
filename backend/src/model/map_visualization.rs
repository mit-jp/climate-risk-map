use super::color_palette::ColorPalette;
use super::data::SourceAndDate;
use super::data_source;
use super::scale_type;
use chrono::NaiveDate;
use derive_more::Display;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::collections::HashMap;

#[derive(Debug, Display)]
pub struct Error {
    pub message: String,
}

impl std::error::Error for Error {}

pub struct Creator {
    pub dataset: i32,
    pub map_type: i32,
    pub color_palette: i32,
    pub scale_type: i32,
    pub formatter_type: i32,
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct Patch {
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
    pub bubble_color: String,
}

impl Patch {
    pub fn new(patch: JsonPatch) -> Patch {
        Patch {
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
            bubble_color: patch.bubble_color,
        }
    }
}

#[derive(FromRow, Deserialize, Serialize)]
pub struct JsonPatch {
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
    pub scale_type: scale_type::Type,
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
    pub bubble_color: String,
}

#[derive(FromRow, Deserialize, Serialize, Debug)]
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
    pub geography_type: i32,
    pub bubble_color: String,
}

#[derive(Deserialize, Serialize)]
pub struct Json {
    pub id: i32,
    pub dataset: i32,
    pub map_type: i32,
    pub subcategory: Option<i32>,
    pub units: String,
    pub short_name: String,
    pub name: Option<String>,
    pub dataset_name: String,
    pub description: String,
    pub legend_ticks: Option<i16>,
    pub color_palette: ColorPalette,
    pub reverse_scale: bool,
    pub invert_normalized: bool,
    pub scale_type: scale_type::Type,
    pub color_domain: Vec<f64>,
    pub date_ranges_by_source: HashMap<i32, Vec<DateRange>>,
    pub sources: HashMap<i32, data_source::DataSource>,
    pub show_pdf: bool,
    pub pdf_domain: Vec<f64>,
    pub default_date_range: Option<DateRange>,
    pub default_source: Option<i32>,
    pub formatter_type: i32,
    pub legend_formatter_type: Option<i32>,
    pub decimals: i16,
    pub legend_decimals: Option<i16>,
    pub order: i16,
    pub geography_type: i32,
    pub bubble_color: String,
}

impl Json {
    pub fn new(
        map_visualization: MapVisualization,
        source_and_dates: Vec<SourceAndDate>,
        data_sources: Vec<data_source::DataSource>,
    ) -> Json {
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
        Json {
            id: map_visualization.id,
            dataset: map_visualization.dataset,
            map_type: map_visualization.map_type,
            subcategory: map_visualization.subcategory,
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
            scale_type: scale_type::Type {
                id: map_visualization.scale_type_id,
                name: map_visualization.scale_type_name,
            },
            color_domain: map_visualization.color_domain,
            date_ranges_by_source,
            sources: data_sources
                .into_iter()
                .map(|data_source| (data_source.id, data_source))
                .collect::<HashMap<i32, data_source::DataSource>>(),
            show_pdf: map_visualization.show_pdf,
            pdf_domain: map_visualization.pdf_domain,
            default_date_range,
            default_source: map_visualization.default_source,
            formatter_type: map_visualization.formatter_type,
            legend_formatter_type: map_visualization.legend_formatter_type,
            decimals: map_visualization.decimals,
            legend_decimals: map_visualization.legend_decimals,
            order: map_visualization.order,
            geography_type: map_visualization.geography_type,
            bubble_color: map_visualization.bubble_color,
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
    use std::convert::TryInto;

    use super::*;

    fn get_models(
        source_ids: Vec<i32>,
    ) -> (
        MapVisualization,
        Vec<SourceAndDate>,
        Vec<data_source::DataSource>,
    ) {
        (
            MapVisualization {
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
                geography_type: 1,
                bubble_color: "black".to_string(),
            },
            source_ids
                .iter()
                .map(|&source| SourceAndDate {
                    source,
                    start_date: NaiveDate::from_ymd_opt(
                        2019,
                        source.try_into().unwrap(),
                        source.try_into().unwrap(),
                    )
                    .unwrap(),
                    end_date: NaiveDate::from_ymd_opt(
                        2020,
                        source.try_into().unwrap(),
                        source.try_into().unwrap(),
                    )
                    .unwrap(),
                })
                .collect(),
            source_ids
                .iter()
                .map(|&id| data_source::DataSource {
                    id,
                    name: id.to_string(),
                    description: id.to_string(),
                    link: id.to_string(),
                })
                .collect(),
        )
    }

    #[test]
    fn it_converts_dates_to_range() {
        let source_id = 1;
        let (map_visualization, source_and_dates, data_sources) = get_models(vec![source_id]);

        let expected_date_range = DateRange::from(source_and_dates.first().unwrap());
        let result = Json::new(map_visualization, source_and_dates, data_sources);

        assert_eq!(
            result.date_ranges_by_source[&source_id][0],
            expected_date_range
        )
    }

    #[test]
    fn no_default_source_carries_through() {
        let (map_visualization, source_and_dates, data_sources) = get_models(vec![1, 2]);
        let result = Json::new(map_visualization, source_and_dates, data_sources);

        assert_eq!(result.default_source, None)
    }

    #[test]
    fn it_uses_default_source_and_date() {
        let (map_visualization, source_and_dates, data_sources) = get_models(vec![1, 2, 3]);
        let map_visualization = MapVisualization {
            default_source: Some(4),
            default_end_date: NaiveDate::from_ymd_opt(2020, 4, 4),
            default_start_date: NaiveDate::from_ymd_opt(2019, 4, 4),
            ..map_visualization
        };
        let result = Json::new(map_visualization, source_and_dates, data_sources);

        assert_eq!(result.default_source, Some(4));
        assert_eq!(
            result.default_date_range,
            Some(DateRange {
                start_date: NaiveDate::from_ymd_opt(2019, 4, 4).unwrap(),
                end_date: NaiveDate::from_ymd_opt(2020, 4, 4).unwrap(),
            })
        )
    }

    #[test]
    fn it_handles_no_sources() {
        let (map_visualization, source_and_dates, data_sources) = get_models(vec![]);
        let result = Json::new(map_visualization, source_and_dates, data_sources);

        assert_eq!(result.default_source, None)
    }

    #[test]
    fn no_default_date_carries_through() {
        let (map_visualization, source_and_dates, data_sources) = get_models(vec![1, 2, 3]);
        let map_visualization = MapVisualization {
            default_source: Some(3),
            ..map_visualization
        };
        let result = Json::new(map_visualization, source_and_dates, data_sources);

        assert_eq!(result.default_date_range, None)
    }
}
