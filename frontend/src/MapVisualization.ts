import { json as loadJson } from 'd3'
import { DateTime, Interval } from 'luxon'
import { MapSelection } from './DataSelector'
import { DataQueryParams, TabId } from './MapApi'

export type MapVisualizationId = number
export type ScaleTypeName =
    | 'Diverging'
    | 'Sequential'
    | 'DivergingSymLog'
    | 'Threshold'
    | 'SequentialSqrt'
export type ScaleType = { id: number; name: ScaleTypeName }
export enum FormatterType {
    MONEY = 1,
    NEAREST_SI_UNIT = 2,
    DEFAULT = 3,
    PERCENT = 4,
}
export type DataSource = {
    name: string
    id: number
    description: string
    link: string
}
export type ColorPalette = {
    name: string
    id: number
}
export enum MapType {
    Choropleth = 1,
    Bubble = 2,
}
export enum GeographyType {
    USACounty = 1,
    World = 2,
    USAState = 3,
    USACity = 4,
}

export function isGeographyType(x: number): x is GeographyType {
    return x in GeographyType
}

export interface MapVisualizationPatch {
    id: MapVisualizationId
    dataset: number
    map_type: MapType
    subcategory?: number
    name?: string
    legend_ticks?: number
    color_palette: ColorPalette
    reverse_scale: boolean
    invert_normalized: boolean
    scale_type: ScaleType
    color_domain: number[]
    show_pdf: boolean
    pdf_domain: [number, number] | []
    default_start_date?: DateTime
    default_end_date?: DateTime
    default_source?: number
    formatter_type: FormatterType
    legend_formatter_type?: FormatterType
    decimals: number
    legend_decimals?: number
    geography_type: GeographyType
    bubble_color: string
}

export type NonEmptyArray<T> = [T, ...T[]]

export const isNonEmpty = <T>(array: T[]): array is NonEmptyArray<T> => array.length > 0

export const last = <T>(array: NonEmptyArray<T>): T => array[array.length - 1] ?? array[0]

export type SourceDateRanges = { id: number; dateRanges: NonEmptyArray<Interval> }

interface MapVisualizationBase {
    id: MapVisualizationId
    dataset: number
    map_type: MapType
    subcategory?: number
    units: string
    short_name: string
    dataset_name: string
    name?: string
    displayName: string
    description: string
    legend_ticks?: number
    color_palette: ColorPalette
    reverse_scale: boolean
    invert_normalized: boolean
    scale_type: ScaleType
    color_domain: number[]
    show_pdf: boolean
    pdf_domain: [number, number] | []
    default_date_range?: Interval
    formatter_type: FormatterType
    legend_formatter_type?: FormatterType
    decimals: number
    legend_decimals?: number
    order: number
    geography_type: GeographyType
    bubble_color: string
}

export interface MapVisualizationWithData extends MapVisualizationBase {
    hasData: true
    date_ranges_by_source: { [key: number]: NonEmptyArray<Interval> }
    sources: { [key: number]: DataSource }
    default_source?: number
}

export interface MapVisualizationWithoutData extends MapVisualizationBase {
    hasData: false
    date_ranges_by_source: Record<number, never>
    sources: Record<number, never>
    default_source?: undefined
}

export type MapVisualization = MapVisualizationWithData | MapVisualizationWithoutData

export interface MapVisualizationJson {
    id: MapVisualizationId
    dataset: number
    map_type: MapType
    subcategory: number | null
    units: string
    short_name: string
    dataset_name: string
    name: string | null
    description: string
    legend_ticks: number | null
    color_palette: ColorPalette
    reverse_scale: boolean
    invert_normalized: boolean
    scale_type: ScaleType
    color_domain: number[]
    date_ranges_by_source: { [key: number]: { start_date: string; end_date: string }[] }
    sources: { [key: number]: DataSource }
    show_pdf: boolean
    pdf_domain: [number, number] | []
    default_date_range: { start_date: string; end_date: string } | null
    default_source: number | null
    formatter_type: FormatterType
    legend_formatter_type: FormatterType | null
    decimals: number
    legend_decimals: number | null
    order: number
    geography_type: GeographyType
    bubble_color: string
}

export const applyPatch = (draft: MapVisualization, patch: MapVisualizationPatch) => {
    Object.assign(draft, patch)
    if (patch.default_end_date && patch.default_start_date) {
        // eslint-disable-next-line no-param-reassign
        draft.default_date_range = Interval.fromDateTimes(
            patch.default_start_date,
            patch.default_end_date
        )
    }
}

const intervalFromJson = (json: { start_date: string; end_date: string }) =>
    Interval.fromISO(`${json.start_date}/${json.end_date}`)

export const jsonToMapVisualization = (json: MapVisualizationJson): MapVisualization => {
    const dateRangesBySource: { [key: number]: NonEmptyArray<Interval> } = {}
    Object.entries(json.date_ranges_by_source).forEach(([sourceId, dateRanges]) => {
        const intervals = dateRanges.map((dateRange) => intervalFromJson(dateRange))
        if (isNonEmpty(intervals)) {
            dateRangesBySource[parseInt(sourceId, 10)] = intervals
        }
    })
    const defaultDateRange =
        json.default_date_range === null ? undefined : intervalFromJson(json.default_date_range)
    const base: MapVisualizationBase = {
        id: json.id,
        dataset: json.dataset,
        map_type: json.map_type,
        subcategory: json.subcategory ?? undefined,
        units: json.units,
        short_name: json.short_name,
        dataset_name: json.dataset_name,
        name: json.name ?? undefined,
        description: json.description,
        legend_ticks: json.legend_ticks ?? undefined,
        color_palette: json.color_palette,
        reverse_scale: json.reverse_scale,
        invert_normalized: json.invert_normalized,
        scale_type: json.scale_type,
        color_domain: json.color_domain,
        show_pdf: json.show_pdf,
        pdf_domain: json.pdf_domain,
        default_date_range: defaultDateRange,
        formatter_type: json.formatter_type,
        legend_formatter_type: json.legend_formatter_type ?? undefined,
        decimals: json.decimals,
        legend_decimals: json.legend_decimals ?? undefined,
        order: json.order,
        displayName: json.name ?? json.dataset_name,
        geography_type: json.geography_type,
        bubble_color: json.bubble_color,
    }
    if (Object.keys(dateRangesBySource).length === 0) {
        return {
            ...base,
            hasData: false,
            date_ranges_by_source: {},
            sources: {},
            default_source: undefined,
        }
    }
    return {
        ...base,
        hasData: true,
        date_ranges_by_source: dateRangesBySource,
        sources: json.sources,
        default_source: json.default_source ?? undefined,
    }
}

export const findSourceDateRanges = (
    mapVisualization: MapVisualization,
    source: number | undefined
): SourceDateRanges | undefined => {
    if (source === undefined) {
        return undefined
    }
    const dateRanges = mapVisualization.date_ranges_by_source[source]
    return dateRanges && { id: source, dateRanges }
}

/** The configured default source, or else the first source; undefined if there's no data */
export const getDefaultSourceDateRanges = (
    mapVisualization: MapVisualization
): SourceDateRanges | undefined => {
    const [first] = Object.keys(mapVisualization.date_ranges_by_source)
    return (
        findSourceDateRanges(mapVisualization, mapVisualization.default_source) ??
        findSourceDateRanges(
            mapVisualization,
            first === undefined ? undefined : parseInt(first, 10)
        )
    )
}

export const getDefaultSelection = (mapVisualization: MapVisualization): MapSelection => {
    const source = getDefaultSourceDateRanges(mapVisualization)
    if (source === undefined) {
        return {
            mapVisualization: mapVisualization.id,
            dataSource: undefined,
            dateRange: undefined,
        }
    }
    return {
        mapVisualization: mapVisualization.id,
        dataSource: source.id,
        dateRange: mapVisualization.default_date_range ?? last(source.dateRanges),
    }
}

export const getDataQueryParams = (
    mapVisualization: MapVisualization
): DataQueryParams[] | undefined => {
    const selection = getDefaultSelection(mapVisualization)
    if (selection.dataSource === undefined) {
        return undefined
    }
    return [
        {
            mapVisualization: mapVisualization.id,
            source: selection.dataSource,
            startDate: selection.dateRange.start.toISODate(),
            endDate: selection.dateRange.end.toISODate(),
        },
    ]
}

export const fetchMapVisualization = async (id: number): Promise<MapVisualization> => {
    const rawJson = await loadJson<MapVisualizationJson>(`/api/map-visualization/${id}`)
    if (rawJson === undefined) {
        return Promise.reject(new Error('Failed to fetch map visualization'))
    }
    return jsonToMapVisualization(rawJson)
}

type RawJson = Record<TabId, Record<MapVisualizationId, MapVisualizationJson>>
type MapVisualizationsByTab = Record<TabId, Record<MapVisualizationId, MapVisualization>>

const transform = (rawJson: RawJson): Record<number, Record<number, MapVisualization>> =>
    Object.entries(rawJson).reduce((accumulator, [tabId, mapVisualizationJsons]) => {
        const mapVisualizations = Object.entries(mapVisualizationJsons).reduce(
            // eslint-disable-next-line @typescript-eslint/no-shadow
            (accumulator, [id, mapVisualizationJson]) => {
                accumulator[parseInt(id, 10)] = jsonToMapVisualization(mapVisualizationJson)
                return accumulator
            },
            {} as Record<MapVisualizationId, MapVisualization>
        )
        accumulator[parseInt(tabId, 10)!] = mapVisualizations
        return accumulator
    }, {} as MapVisualizationsByTab)

export const fetchMapVisualizations = async (props: {
    includeDrafts?: boolean
    geographyType?: GeographyType
}): Promise<MapVisualizationsByTab> => {
    const rawJson = await loadJson<RawJson>(
        `/api/map-visualization?include_drafts=${props.includeDrafts ?? false}${
            props.geographyType !== undefined ? `&geography_type=${props.geographyType}` : ''
        }`
    )
    if (rawJson === undefined) {
        return Promise.reject(new Error('Failed to fetch map visualizations'))
    }
    return transform(rawJson)
}

export const fetchMapVisualizationsByDataset = async (
    dataset: number
): Promise<MapVisualizationsByTab> => {
    const rawJson = await loadJson<RawJson>(`/api/dataset/${dataset}/map-visualization`)
    if (rawJson === undefined) {
        return Promise.reject(new Error('Failed to fetch map visualizations'))
    }
    return transform(rawJson)
}
