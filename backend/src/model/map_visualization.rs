use super::color_palette::ColorPalette;
use super::data_source::{DataSource, DatedSource};
use super::scale_type;
use chrono::NaiveDate;
use derive_more::Display;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::collections::BTreeMap;

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
    pub show_pdf: bool,
    pub pdf_domain: Vec<f64>,
    pub formatter_type: i32,
    pub legend_formatter_type: Option<i32>,
    pub decimals: i16,
    pub legend_decimals: Option<i16>,
    pub order: i16,
    pub geography_type: i32,
    pub bubble_color: String,
    /// None when the dataset has no data
    pub data: Option<Data>,
}

impl Json {
    pub fn new(map_visualization: MapVisualization, dated_sources: Vec<DatedSource>) -> Json {
        let default_date_range = match (
            map_visualization.default_start_date,
            map_visualization.default_end_date,
        ) {
            (Some(start_date), Some(end_date)) => Some(DateRange {
                start_date,
                end_date,
            }),
            _ => None,
        };
        let data = Data::new(
            dated_sources,
            map_visualization.default_source,
            default_date_range,
        );
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
            show_pdf: map_visualization.show_pdf,
            pdf_domain: map_visualization.pdf_domain,
            formatter_type: map_visualization.formatter_type,
            legend_formatter_type: map_visualization.legend_formatter_type,
            decimals: map_visualization.decimals,
            legend_decimals: map_visualization.legend_decimals,
            order: map_visualization.order,
            geography_type: map_visualization.geography_type,
            bubble_color: map_visualization.bubble_color,
            data,
        }
    }
}

/// The sources with data in a map visualization's dataset, with the configured defaults
/// resolved against them so that both are always selectable
#[derive(Deserialize, Serialize, PartialEq, Debug)]
pub struct Data {
    /// The configured default source if it has data, or else the source with the lowest id
    pub default_source: SourceDateRanges,
    /// Every other source, ordered by id
    pub other_sources: Vec<SourceDateRanges>,
}

impl Data {
    /// None when there are no dated sources. The default date range belongs to the default
    /// source, so it's ignored when that source has no data.
    pub fn new(
        dated_sources: Vec<DatedSource>,
        default_source: Option<i32>,
        default_date_range: Option<DateRange>,
    ) -> Option<Data> {
        let mut date_ranges_by_source: BTreeMap<i32, (DataSource, Vec<DateRange>)> =
            BTreeMap::new();
        for DatedSource {
            id,
            name,
            description,
            link,
            start_date,
            end_date,
        } in dated_sources
        {
            date_ranges_by_source
                .entry(id)
                .or_insert_with(|| {
                    (
                        DataSource {
                            id,
                            name,
                            description,
                            link,
                        },
                        Vec::new(),
                    )
                })
                .1
                .push(DateRange {
                    start_date,
                    end_date,
                });
        }
        let mut sources: Vec<SourceDateRanges> = date_ranges_by_source
            .into_values()
            .filter_map(|(source, date_ranges)| {
                let default_date_range =
                    default_date_range.filter(|_| default_source == Some(source.id));
                SourceDateRanges::new(source, date_ranges, default_date_range)
            })
            .collect();
        let default_index = default_source
            .and_then(|id| sources.iter().position(|source| source.source.id == id))
            .unwrap_or(0);
        if sources.is_empty() {
            return None;
        }
        let default_source = sources.remove(default_index);
        Some(Data {
            default_source,
            other_sources: sources,
        })
    }
}

/// A source with the date ranges it has data for in a dataset
#[derive(Deserialize, Serialize, PartialEq, Debug)]
pub struct SourceDateRanges {
    #[serde(flatten)]
    pub source: DataSource,
    /// Never empty, ordered by start date and then end date
    pub date_ranges: Vec<DateRange>,
    /// The map's configured default date range if this is its configured default source and
    /// it has that date range, or else its last
    pub default_date_range: DateRange,
}

impl SourceDateRanges {
    /// None when date_ranges is empty
    fn new(
        source: DataSource,
        mut date_ranges: Vec<DateRange>,
        default_date_range: Option<DateRange>,
    ) -> Option<SourceDateRanges> {
        date_ranges.sort();
        date_ranges.dedup();
        let default_date_range = default_date_range
            .filter(|date_range| date_ranges.contains(date_range))
            .or_else(|| date_ranges.last().copied())?;
        Some(SourceDateRanges {
            source,
            date_ranges,
            default_date_range,
        })
    }
}

#[derive(FromRow, Deserialize, Serialize, PartialEq, Eq, PartialOrd, Ord, Clone, Copy, Debug)]
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

    fn date_range(month: u32) -> DateRange {
        DateRange {
            start_date: NaiveDate::from_ymd_opt(2019, month, 1).unwrap(),
            end_date: NaiveDate::from_ymd_opt(2020, month, 1).unwrap(),
        }
    }

    fn data(map_visualization: MapVisualization, dated_sources: Vec<DatedSource>) -> Data {
        Json::new(map_visualization, dated_sources)
            .data
            .expect("expected data")
    }

    fn source_ids(data: &Data) -> Vec<i32> {
        std::iter::once(&data.default_source)
            .chain(&data.other_sources)
            .map(|source| source.source.id)
            .collect()
    }

    #[test]
    fn it_converts_dates_to_range() {
        let (map_visualization, dated_sources) = get_models(vec![1]);
        let result = data(map_visualization, dated_sources);

        assert_eq!(result.default_source.date_ranges, vec![date_range(1)])
    }

    #[test]
    fn without_a_default_source_it_uses_the_first() {
        let (map_visualization, dated_sources) = get_models(vec![2, 1]);
        let result = data(map_visualization, dated_sources);

        assert_eq!(source_ids(&result), vec![1, 2])
    }

    #[test]
    fn it_uses_default_source_and_date() {
        let dated_sources = vec![dated_source(1, 1), dated_source(3, 3), dated_source(3, 4)];
        let result = data(with_defaults(3, 3), dated_sources);

        assert_eq!(source_ids(&result), vec![3, 1]);
        assert_eq!(result.default_source.default_date_range, date_range(3))
    }

    #[test]
    fn it_has_no_data_without_sources() {
        let (map_visualization, _) = get_models(vec![]);
        let map_visualization = MapVisualization {
            default_source: Some(3),
            ..map_visualization
        };
        let result = Json::new(map_visualization, vec![]);

        assert_eq!(result.data, None)
    }

    #[test]
    fn without_a_default_date_it_uses_the_last() {
        let (map_visualization, _) = get_models(vec![]);
        let dated_sources = vec![dated_source(1, 2), dated_source(1, 1)];
        let result = data(map_visualization, dated_sources);

        assert_eq!(result.default_source.default_date_range, date_range(2))
    }

    fn with_defaults(source: i32, month: u32) -> MapVisualization {
        let (map_visualization, _) = get_models(vec![]);
        MapVisualization {
            default_source: Some(source),
            default_start_date: Some(date_range(month).start_date),
            default_end_date: Some(date_range(month).end_date),
            ..map_visualization
        }
    }

    #[test]
    fn it_uses_the_default_date_only_for_the_default_source() {
        let dated_sources = vec![
            dated_source(1, 1),
            dated_source(1, 2),
            dated_source(2, 1),
            dated_source(2, 3),
        ];
        let result = data(with_defaults(2, 1), dated_sources);

        assert_eq!(result.default_source.source.id, 2);
        assert_eq!(result.default_source.default_date_range, date_range(1));
        assert_eq!(result.other_sources[0].default_date_range, date_range(2))
    }

    #[test]
    fn it_ignores_the_default_date_when_the_default_source_has_no_data() {
        let dated_sources = vec![dated_source(1, 1), dated_source(1, 2)];
        let result = data(with_defaults(9, 1), dated_sources);

        assert_eq!(result.default_source.source.id, 1);
        assert_eq!(result.default_source.default_date_range, date_range(2))
    }

    #[test]
    fn it_ignores_a_default_date_the_default_source_lacks() {
        let dated_sources = vec![dated_source(1, 1), dated_source(1, 2)];
        let result = data(with_defaults(1, 5), dated_sources);

        assert_eq!(result.default_source.default_date_range, date_range(2))
    }

    #[test]
    fn it_groups_and_sorts_date_ranges_by_source() {
        let (map_visualization, _) = get_models(vec![]);
        let dated_sources = vec![dated_source(1, 2), dated_source(2, 3), dated_source(1, 1)];
        let result = data(map_visualization, dated_sources);

        assert_eq!(
            result.default_source.date_ranges,
            vec![date_range(1), date_range(2)]
        );
        assert_eq!(result.other_sources[0].date_ranges, vec![date_range(3)]);
    }

    #[test]
    fn it_ignores_a_default_source_without_data() {
        let (map_visualization, dated_sources) = get_models(vec![1, 2]);
        let map_visualization = MapVisualization {
            default_source: Some(3),
            ..map_visualization
        };
        let result = data(map_visualization, dated_sources);

        assert_eq!(source_ids(&result), vec![1, 2])
    }

    #[test]
    fn it_serializes_each_source_with_its_dates() {
        let (map_visualization, dated_sources) = get_models(vec![1]);
        let result = serde_json::to_value(data(map_visualization, dated_sources)).unwrap();

        assert_eq!(
            result,
            serde_json::json!({
                "default_source": {
                    "id": 1,
                    "name": "1",
                    "description": "1",
                    "link": "1",
                    "date_ranges": [{ "start_date": "2019-01-01", "end_date": "2020-01-01" }],
                    "default_date_range": { "start_date": "2019-01-01", "end_date": "2020-01-01" },
                },
                "other_sources": [],
            })
        )
    }
}
