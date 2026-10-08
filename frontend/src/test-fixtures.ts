import { Interval } from 'luxon'
import {
    FormatterType,
    GeographyType,
    jsonToMapVisualization,
    MapType,
    MapVisualization,
    MapVisualizationJson,
} from './MapVisualization'

export const interval = (startYear: number, endYear: number): Interval =>
    Interval.fromISO(`${startYear}-01-01/${endYear}-12-31`)

/** A date range as stored in a MapSelection */
export const isoInterval = (startYear: number, endYear: number): string =>
    interval(startYear, endYear).toISODate()

export const dateRangeJson = (startYear: number, endYear: number) => ({
    start_date: `${startYear}-01-01`,
    end_date: `${endYear}-12-31`,
})

/** The raw backend shape of a map visualization with one source and date range. */
export const makeMapVisualizationJson = (
    overrides: Partial<MapVisualizationJson> = {}
): MapVisualizationJson => ({
    id: 71,
    dataset: 69,
    map_type: MapType.Choropleth,
    subcategory: null,
    units: 'people',
    short_name: 'test_map',
    name: null,
    dataset_name: 'Test dataset',
    description: 'A dataset for testing',
    legend_ticks: null,
    color_palette: { id: 45, name: 'YlOrBr' },
    reverse_scale: false,
    invert_normalized: false,
    scale_type: { id: 5, name: 'SequentialSqrt' },
    color_domain: [0, 10],
    date_ranges_by_source: {
        12: [{ start_date: '2015-01-01', end_date: '2015-12-31' }],
    },
    sources: {
        12: { id: 12, name: 'Test source', description: 'A source for testing', link: '' },
    },
    show_pdf: true,
    pdf_domain: [],
    default_date_range: null,
    default_source: null,
    formatter_type: FormatterType.DEFAULT,
    legend_formatter_type: null,
    decimals: 0,
    legend_decimals: null,
    order: 1,
    geography_type: GeographyType.USACounty,
    bubble_color: '#000000',
    ...overrides,
})

/** A map visualization with a single data source and two date ranges. */
export const makeMapVisualization = (
    overrides: Partial<MapVisualizationJson> = {}
): MapVisualization =>
    jsonToMapVisualization(
        makeMapVisualizationJson({
            date_ranges_by_source: { 12: [dateRangeJson(2014, 2014), dateRangeJson(2015, 2015)] },
            ...overrides,
        })
    )

/** A map visualization whose dataset has no data rows. */
export const makeEmptyMapVisualization = (
    overrides: Partial<MapVisualizationJson> = {}
): MapVisualization =>
    jsonToMapVisualization(
        makeMapVisualizationJson({ sources: {}, date_ranges_by_source: {}, ...overrides })
    )
