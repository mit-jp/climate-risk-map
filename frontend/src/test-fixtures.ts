import { Interval } from 'luxon'
import {
    FormatterType,
    GeographyType,
    MapType,
    MapVisualizationJson,
    MapVisualizationWithData,
    MapVisualizationWithoutData,
} from './MapVisualization'

export const interval = (startYear: number, endYear: number): Interval =>
    Interval.fromISO(`${startYear}-01-01/${endYear}-12-31`)

const baseMapVisualization = {
    id: 71,
    dataset: 69,
    map_type: MapType.Choropleth,
    units: 'people',
    short_name: 'test_map',
    dataset_name: 'Test dataset',
    displayName: 'Test dataset',
    description: 'A dataset for testing',
    color_palette: { id: 45, name: 'YlOrBr' as const },
    reverse_scale: false,
    invert_normalized: false,
    scale_type: { id: 5, name: 'SequentialSqrt' as const },
    color_domain: [0, 10],
    show_pdf: true,
    pdf_domain: [] as [],
    formatter_type: FormatterType.DEFAULT,
    decimals: 0,
    order: 1,
    geography_type: GeographyType.USACounty,
    bubble_color: '#000000',
}

/** A map visualization with a single data source and two date ranges. */
export const makeMapVisualization = (
    overrides: Partial<MapVisualizationWithData> = {}
): MapVisualizationWithData => ({
    ...baseMapVisualization,
    hasData: true,
    date_ranges_by_source: { 12: [interval(2014, 2014), interval(2015, 2015)] },
    sources: {
        12: { id: 12, name: 'Test source', description: 'A source for testing', link: '' },
    },
    ...overrides,
})

/** A map visualization whose dataset has no data rows. */
export const makeEmptyMapVisualization = (
    overrides: Partial<MapVisualizationWithoutData> = {}
): MapVisualizationWithoutData => ({
    ...baseMapVisualization,
    hasData: false,
    date_ranges_by_source: {},
    sources: {},
    default_source: undefined,
    ...overrides,
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
