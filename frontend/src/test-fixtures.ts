import { Interval } from 'luxon'
import {
    DataSource,
    FormatterType,
    GeographyType,
    jsonToMapVisualization,
    last,
    MapType,
    MapVisualization,
    MapVisualizationJson,
    NonEmptyArray,
    SourcesJson,
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

export const sourceJson = (id: number): DataSource => ({
    id,
    name: `Source ${id}`,
    description: 'A source for testing',
    link: '',
})

type SourceDateRangesJson = SourcesJson['default_source']

/** A source with data for the given years, defaulting to the last */
export const sourceDateRangesJson = (
    source: DataSource,
    years: NonEmptyArray<number>,
    defaultYear: number = last(years)
): SourceDateRangesJson => ({
    ...source,
    date_ranges: [
        dateRangeJson(years[0], years[0]),
        ...years.slice(1).map((year) => dateRangeJson(year, year)),
    ],
    default_date_range: dateRangeJson(defaultYear, defaultYear),
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
    show_pdf: true,
    pdf_domain: [],
    formatter_type: FormatterType.DEFAULT,
    legend_formatter_type: null,
    decimals: 0,
    legend_decimals: null,
    order: 1,
    geography_type: GeographyType.USACounty,
    bubble_color: '#000000',
    sources: {
        default_source: sourceDateRangesJson(
            { id: 12, name: 'Test source', description: 'A source for testing', link: '' },
            [2015]
        ),
        other_sources: [],
    },
    ...overrides,
})

/** A map visualization with a single data source and two date ranges. */
export const makeMapVisualization = (
    overrides: Partial<MapVisualizationJson> = {}
): MapVisualization =>
    jsonToMapVisualization(
        makeMapVisualizationJson({
            sources: {
                default_source: sourceDateRangesJson(sourceJson(12), [2014, 2015]),
                other_sources: [],
            },
            ...overrides,
        })
    )

/** A map visualization whose dataset has no data rows. */
export const makeEmptyMapVisualization = (
    overrides: Partial<MapVisualizationJson> = {}
): MapVisualization =>
    jsonToMapVisualization(makeMapVisualizationJson({ sources: null, ...overrides }))
