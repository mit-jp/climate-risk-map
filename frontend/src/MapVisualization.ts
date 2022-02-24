import { DateTime, Interval } from 'luxon'
import { json as loadJson } from 'd3'
import DataTab from './DataTab'
import { DataQueryParams } from './MapApi'

export const TabIdToTab: { [key: number]: DataTab } = {
    8: DataTab.RiskMetrics,
    3: DataTab.Climate,
    1: DataTab.Water,
    2: DataTab.Land,
    5: DataTab.Energy,
    4: DataTab.Economy,
    7: DataTab.Demographics,
    6: DataTab.ClimateOpinions,
    9: DataTab.Health,
}
export const TabToId: { [key in DataTab]: number } = {
    [DataTab.RiskMetrics]: 8,
    [DataTab.Climate]: 3,
    [DataTab.Water]: 1,
    [DataTab.Land]: 2,
    [DataTab.Energy]: 5,
    [DataTab.Economy]: 4,
    [DataTab.Demographics]: 7,
    [DataTab.ClimateOpinions]: 6,
    [DataTab.Health]: 9,
}
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

export interface MapVisualizationPatch {
    id: MapVisualizationId
    dataset?: number
    map_type?: MapType
    subcategory?: number | null
    data_tab?: number | null
    name?: string | null
    legend_ticks?: number | null
    color_palette?: ColorPalette
    reverse_scale?: boolean
    invert_normalized?: boolean
    scale_type?: ScaleType
    color_domain?: number[]
    show_pdf?: boolean
    pdf_domain?: [number, number] | []
    default_start_date?: DateTime | null
    default_end_date?: DateTime | null
    default_source?: number | null
    formatter_type?: FormatterType
    legend_formatter_type?: FormatterType | null
    decimals?: number
    legend_decimals?: number | null
}

export interface MapVisualization {
    id: MapVisualizationId
    dataset: number
    map_type: MapType
    subcategory?: number
    data_tab: number
    units: string
    short_name: string
    name: string
    description: string
    legend_ticks?: number
    color_palette: ColorPalette
    reverse_scale: boolean
    invert_normalized: boolean
    scale_type: ScaleType
    color_domain: number[]
    date_ranges_by_source: { [key: number]: Interval[] }
    sources: { [key: number]: DataSource }
    show_pdf: boolean
    pdf_domain: [number, number] | []
    default_date_range?: Interval
    default_source?: number
    formatter_type: FormatterType
    legend_formatter_type?: FormatterType
    decimals: number
    legend_decimals?: number
    order: number
}
export type MapVisualizationByTabId = {
    [key: number]: { [key in MapVisualizationId]: MapVisualization }
}

export interface MapVisualizationJson {
    id: MapVisualizationId
    dataset: number
    map_type: MapType
    subcategory: number | null
    data_tab: number
    units: string
    short_name: string
    name: string
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
    const dateRangesBySource = Object.entries(json.date_ranges_by_source)
        .map(
            ([sourceId, dateRanges]) =>
                [
                    parseInt(sourceId, 10),
                    dateRanges.map((dateRange) => intervalFromJson(dateRange)),
                ] as [number, Interval[]]
        )
        .reduce((accumulator, [sourceId, dateRanges]) => {
            accumulator[sourceId] = dateRanges
            return accumulator
        }, {} as { [key: number]: Interval[] })
    const defaultDateRange =
        json.default_date_range === null ? undefined : intervalFromJson(json.default_date_range)
    return {
        id: json.id,
        dataset: json.dataset,
        map_type: json.map_type,
        subcategory: json.subcategory ?? undefined,
        data_tab: json.data_tab,
        units: json.units,
        short_name: json.short_name,
        name: json.name,
        description: json.description,
        legend_ticks: json.legend_ticks ?? undefined,
        color_palette: json.color_palette,
        reverse_scale: json.reverse_scale,
        invert_normalized: json.invert_normalized,
        scale_type: json.scale_type,
        color_domain: json.color_domain,
        date_ranges_by_source: dateRangesBySource,
        sources: json.sources,
        show_pdf: json.show_pdf,
        pdf_domain: json.pdf_domain,
        default_date_range: defaultDateRange,
        default_source: json.default_source ?? undefined,
        formatter_type: json.formatter_type,
        legend_formatter_type: json.legend_formatter_type ?? undefined,
        decimals: json.decimals,
        legend_decimals: json.legend_decimals ?? undefined,
        order: json.order,
    }
}

export const defaultMapVisualizations: MapVisualizationByTabId = {
    8: {},
    1: {},
    2: {},
    3: {},
    4: {},
    7: {},
    6: {},
    5: {},
}

export const getDefaultSource = (mapVisualization: MapVisualization) =>
    mapVisualization.default_source ??
    Object.keys(mapVisualization.date_ranges_by_source).map((key) => parseInt(key, 10))[0]

export const getDefaultDateRange = (mapVisualization: MapVisualization) =>
    mapVisualization.default_date_range ??
    mapVisualization.date_ranges_by_source[getDefaultSource(mapVisualization)][0]

export const getDataQueryParams = (mapVisualization: MapVisualization): DataQueryParams[] => {
    const source = getDefaultSource(mapVisualization)
    const dateRange = getDefaultDateRange(mapVisualization)
    return [
        {
            dataset: mapVisualization.dataset,
            source,
            startDate: dateRange.start.toISODate(),
            endDate: dateRange.end.toISODate(),
        },
    ]
}

export const fetchMapVisualization = async (id: number): Promise<MapVisualization> => {
    const rawJson = await loadJson<MapVisualizationJson>(`api/map-visualization/${id}`)
    if (rawJson === undefined) {
        return Promise.reject(new Error('Failed to fetch map visualization'))
    }
    return jsonToMapVisualization(rawJson)
}

export const fetchMapVisualizations = async (): Promise<MapVisualizationByTabId> => {
    const rawJson = await loadJson<{ [key: number]: { [key: number]: MapVisualizationJson } }>(
        'api/map-visualization'
    )
    if (rawJson === undefined) {
        return Promise.reject(new Error('Failed to fetch map visualizations'))
    }
    const mapVisualizationsByTab = Object.entries(rawJson).reduce(
        (accumulator, [tabId, mapVisualizationJsons]) => {
            const mapVisualizations = Object.entries(mapVisualizationJsons).reduce(
                // eslint-disable-next-line @typescript-eslint/no-shadow
                (accumulator, [id, mapVisualizationJson]) => {
                    accumulator[parseInt(id, 10)] = jsonToMapVisualization(mapVisualizationJson)
                    return accumulator
                },
                {} as { [key in MapVisualizationId]: MapVisualization }
            )
            accumulator[parseInt(tabId, 10)!] = mapVisualizations
            return accumulator
        },
        {} as MapVisualizationByTabId
    )
    return mapVisualizationsByTab
}
