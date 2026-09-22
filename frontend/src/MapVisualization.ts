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

/** A source with its date ranges, which the backend guarantees are non-empty */
export type SourceDateRanges = DataSource & {
    readonly dateRanges: NonEmptyArray<Interval>
    /** The map's configured default date range if this source has it, or else its last */
    readonly defaultDateRange: Interval
}

/** A date range of a source. Build it with selectDateRange so dateRange is one of source.dateRanges */
export type DataSelection = {
    readonly source: SourceDateRanges
    readonly dateRange: Interval
}

export type MapVisualizationData = {
    readonly sources: Readonly<Record<number, SourceDateRanges>>
    /** The configured default source, or else the first source */
    readonly defaultSource: SourceDateRanges
}

export interface MapVisualization {
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
    /** As configured in the editor; data.defaultSource has the resolved default */
    default_date_range?: Interval
    /** As configured in the editor; data.defaultSource has the resolved default */
    default_source?: number
    formatter_type: FormatterType
    legend_formatter_type?: FormatterType
    decimals: number
    legend_decimals?: number
    order: number
    geography_type: GeographyType
    bubble_color: string
    /** undefined when the dataset has no data */
    data: MapVisualizationData | undefined
}

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

type UnresolvedSource = DataSource & { dateRanges: NonEmptyArray<Interval> }

const resolveDefaults = (
    sources: Readonly<Record<number, UnresolvedSource>>,
    defaultSourceId: number | undefined,
    defaultDateRange: Interval | undefined
): MapVisualizationData | undefined => {
    const resolved: Record<number, SourceDateRanges> = {}
    Object.values(sources).forEach((source) => {
        resolved[source.id] = {
            ...source,
            defaultDateRange:
                source.dateRanges.find(
                    (dateRange) =>
                        defaultDateRange !== undefined && dateRange.equals(defaultDateRange)
                ) ?? last(source.dateRanges),
        }
    })
    const [first] = Object.values(resolved)
    if (first === undefined) {
        return undefined
    }
    const defaultSource =
        (defaultSourceId === undefined ? undefined : resolved[defaultSourceId]) ?? first
    return { sources: resolved, defaultSource }
}

export const applyPatch = (draft: MapVisualization, patch: MapVisualizationPatch) => {
    const { default_start_date: start, default_end_date: end, ...rest } = patch
    Object.assign(draft, rest)
    if (start && end) {
        // eslint-disable-next-line no-param-reassign
        draft.default_date_range = Interval.fromDateTimes(start, end)
    }
    if (draft.data) {
        // eslint-disable-next-line no-param-reassign
        draft.data = resolveDefaults(
            draft.data.sources,
            draft.default_source,
            draft.default_date_range
        )
    }
}

const intervalFromJson = (json: { start_date: string; end_date: string }) =>
    Interval.fromISO(`${json.start_date}/${json.end_date}`)

const sourcesFromJson = (json: MapVisualizationJson): Record<number, UnresolvedSource> => {
    const sources: Record<number, UnresolvedSource> = {}
    Object.entries(json.date_ranges_by_source).forEach(([sourceId, dateRangeJsons]) => {
        const source = json.sources[parseInt(sourceId, 10)]
        const dateRanges = dateRangeJsons.map(intervalFromJson)
        if (source !== undefined && isNonEmpty(dateRanges)) {
            sources[source.id] = { ...source, dateRanges }
        }
    })
    return sources
}

export const jsonToMapVisualization = (json: MapVisualizationJson): MapVisualization => {
    const defaultDateRange =
        json.default_date_range === null ? undefined : intervalFromJson(json.default_date_range)
    const defaultSource = json.default_source ?? undefined
    return {
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
        default_source: defaultSource,
        formatter_type: json.formatter_type,
        legend_formatter_type: json.legend_formatter_type ?? undefined,
        decimals: json.decimals,
        legend_decimals: json.legend_decimals ?? undefined,
        order: json.order,
        displayName: json.name ?? json.dataset_name,
        geography_type: json.geography_type,
        bubble_color: json.bubble_color,
        data: resolveDefaults(sourcesFromJson(json), defaultSource, defaultDateRange),
    }
}

/** The preferred date range if the source has it, or else the source's default */
export const selectDateRange = (
    source: SourceDateRanges,
    /** ISO interval, as stored in a MapSelection */
    preferred: string | undefined
): DataSelection => ({
    source,
    dateRange:
        source.dateRanges.find((dateRange) => dateRange.toISODate() === preferred) ??
        source.defaultDateRange,
})

/** The preferred source and date range where the map has them, or else its defaults */
const selectData = (
    data: MapVisualizationData,
    preferred: { dataSource?: number; dateRange?: string } = {}
): DataSelection =>
    selectDateRange(
        (preferred.dataSource === undefined ? undefined : data.sources[preferred.dataSource]) ??
            data.defaultSource,
        preferred.dateRange
    )

/** A map selection checked against its map visualization, so it can't be invalid */
export type ResolvedSelection = {
    readonly mapVisualization: MapVisualization
    /** undefined when the map visualization has no data */
    readonly data: DataSelection | undefined
}

export const resolveSelection = (
    mapVisualization: MapVisualization,
    selection?: MapSelection
): ResolvedSelection => ({
    mapVisualization,
    data: mapVisualization.data && selectData(mapVisualization.data, selection),
})

/** Resolves each selection whose map visualization is loaded */
export const resolveSelections = (
    mapVisualizations: Readonly<Record<MapVisualizationId, MapVisualization>>,
    selections: MapSelection[]
): ResolvedSelection[] =>
    selections.flatMap((selection) => {
        const mapVisualization = mapVisualizations[selection.mapVisualization]
        return mapVisualization ? [resolveSelection(mapVisualization, selection)] : []
    })

export const toMapSelection = ({ mapVisualization, data }: ResolvedSelection): MapSelection => ({
    mapVisualization: mapVisualization.id,
    dataSource: data?.source.id,
    dateRange: data?.dateRange.toISODate(),
})

export const getDefaultSelection = (mapVisualization: MapVisualization): MapSelection =>
    toMapSelection(resolveSelection(mapVisualization))

/** undefined when none of the selections have data */
export const getDataQueryParams = (
    selections: ResolvedSelection[]
): DataQueryParams[] | undefined => {
    const params = selections.flatMap(({ mapVisualization, data }) =>
        data === undefined
            ? []
            : [
                  {
                      mapVisualization: mapVisualization.id,
                      source: data.source.id,
                      startDate: data.dateRange.start.toISODate(),
                      endDate: data.dateRange.end.toISODate(),
                  },
              ]
    )
    return isNonEmpty(params) ? params : undefined
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
