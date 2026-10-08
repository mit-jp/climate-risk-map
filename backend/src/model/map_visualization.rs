use super::color_palette::ColorPalette;
use super::data_source::{self, DatedSource};
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
    pub fn new(map_visualization: MapVisualization, dated_sources: Vec<DatedSource>) -> Json {
        let mut date_ranges_by_source: HashMap<i32, Vec<DateRange>> = HashMap::new();
        let mut sources = HashMap::new();
        for dated_source in dated_sources {
            date_ranges_by_source
                .entry(dated_source.id)
                .or_default()
                .push(DateRange {
                    start_date: dated_source.start_date,
                    end_date: dated_source.end_date,
                });
            sources
                .entry(dated_source.id)
                .or_insert_with(|| data_source::DataSource {
                    id: dated_source.id,
                    name: dated_source.name,
                    description: dated_source.description,
                    link: dated_source.link,
                });
        }
        let default_source = map_visualization
            .default_source
            .filter(|source| sources.contains_key(source));
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
            sources,
            show_pdf: map_visualization.show_pdf,
            pdf_domain: map_visualization.pdf_domain,
            default_date_range,
            default_source,
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

#[cfg(test)]
mod tests {
    use std::convert::TryInto;

    use super::*;

    fn get_models(source_ids: Vec<i32>) -> (MapVisualization, Vec<DatedSource>) {
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
                .map(|&id| dated_source(id, id.try_into().unwrap()))
                .collect(),
        )
    }

    fn dated_source(id: i32, month: u32) -> DatedSource {
        DatedSource {
            id,
            name: id.to_string(),
            description: id.to_string(),
            link: id.to_string(),
            start_date: NaiveDate::from_ymd_opt(2019, month, 1).unwrap(),
            end_date: NaiveDate::from_ymd_opt(2020, month, 1).unwrap(),
        }
    }

    #[test]
    fn it_converts_dates_to_range() {
        let (map_visualization, dated_sources) = get_models(vec![1]);
        let result = Json::new(map_visualization, dated_sources);

        assert_eq!(
            result.date_ranges_by_source[&1],
            vec![DateRange {
                start_date: NaiveDate::from_ymd_opt(2019, 1, 1).unwrap(),
                end_date: NaiveDate::from_ymd_opt(2020, 1, 1).unwrap(),
            }]
        )
    }

    #[test]
    fn no_default_source_carries_through() {
        let (map_visualization, dated_sources) = get_models(vec![1, 2]);
        let result = Json::new(map_visualization, dated_sources);

        assert_eq!(result.default_source, None)
    }

    #[test]
    fn it_uses_default_source_and_date() {
        let (map_visualization, dated_sources) = get_models(vec![1, 2, 3]);
        let map_visualization = MapVisualization {
            default_source: Some(3),
            default_end_date: NaiveDate::from_ymd_opt(2020, 4, 4),
            default_start_date: NaiveDate::from_ymd_opt(2019, 4, 4),
            ..map_visualization
        };
        let result = Json::new(map_visualization, dated_sources);

        assert_eq!(result.default_source, Some(3));
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
        let (map_visualization, dated_sources) = get_models(vec![]);
        let result = Json::new(map_visualization, dated_sources);

        assert_eq!(result.default_source, None)
    }

    #[test]
    fn no_default_date_carries_through() {
        let (map_visualization, dated_sources) = get_models(vec![1, 2, 3]);
        let map_visualization = MapVisualization {
            default_source: Some(3),
            ..map_visualization
        };
        let result = Json::new(map_visualization, dated_sources);

        assert_eq!(result.default_date_range, None)
    }

    #[test]
    fn it_groups_date_ranges_by_source() {
        let (map_visualization, _) = get_models(vec![]);
        let dated_sources = vec![dated_source(1, 1), dated_source(1, 2), dated_source(2, 3)];
        let result = Json::new(map_visualization, dated_sources);

        assert_eq!(result.date_ranges_by_source[&1].len(), 2);
        assert_eq!(result.date_ranges_by_source[&2].len(), 1);
        let mut source_ids: Vec<_> = result.sources.keys().collect();
        source_ids.sort();
        let mut date_range_ids: Vec<_> = result.date_ranges_by_source.keys().collect();
        date_range_ids.sort();
        assert_eq!(source_ids, date_range_ids);
    }

    #[test]
    fn it_drops_a_default_source_without_data() {
        let (map_visualization, dated_sources) = get_models(vec![1, 2]);
        let map_visualization = MapVisualization {
            default_source: Some(3),
            ..map_visualization
        };
        let result = Json::new(map_visualization, dated_sources);

        assert_eq!(result.default_source, None)
    }
}
