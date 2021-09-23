import { Interval } from "luxon";
import DataTab from "./DataTab";
import { json } from "d3";
import { Map } from "immutable";

export const DatabaseToTab = Map([
    [8, DataTab.RiskMetrics],
    [3, DataTab.Climate],
    [1, DataTab.Water],
    [2, DataTab.Land],
    [5, DataTab.Energy],
    [4, DataTab.Economy],
    [7, DataTab.Demographics],
    [6, DataTab.ClimateOpinions],
]);
export type MapVisualizationId = number;
export type ScaleType = "Diverging" | "Sequential" | "DivergingSymLog" | "Threshold" | "SequentialSqrt";
export enum FormatterType {
    MONEY = 1,
    NEAREST_SI_UNIT = 2,
    DEFAULT = 3,
}
export type DataSource = {
    name: string,
    id: number,
    description: string,
    link: string,
};
export type ColorPalette = string;
export enum MapType {
    Choropleth = 1,
    Bubble = 2,
}
export type MapVisualizationByTab = { [key in DataTab]: { [key in MapVisualizationId]: MapVisualization } };
export interface MapVisualization {
    id: MapVisualizationId;
    dataset: number;
    map_type: MapType;
    subcategory?: number;
    data_tab: number;
    units: string;
    short_name: string;
    name: string;
    description: string;
    legend_ticks?: number;
    should_normalize: boolean;
    color_palette: ColorPalette;
    reverse_scale: boolean;
    invert_normalized: boolean;
    scale_type: ScaleType;
    scale_domain: number[];
    date_ranges_by_source: { [key: number]: Interval[]; };
    sources: { [key: number]: DataSource; };
    show_pdf: boolean;
    pdf_domain?: [number, number];
    default_date_range?: Interval;
    default_source?: number;
    formatter_type: FormatterType;
    legend_formatter_type?: FormatterType;
    decimals: number;
    legend_decimals?: number;
    order: number;
}

export interface MapVisualizationJson {
    id: MapVisualizationId;
    dataset: number;
    map_type: MapType;
    subcategory: number | null;
    data_tab: number;
    units: string;
    short_name: string;
    name: string;
    description: string;
    legend_ticks: number | null;
    should_normalize: boolean;
    color_palette: ColorPalette;
    reverse_scale: boolean;
    invert_normalized: boolean;
    scale_type: ScaleType;
    scale_domain: number[];
    date_ranges_by_source: { [key: number]: { start_date: string, end_date: string }[] };
    sources: { [key: number]: DataSource };
    show_pdf: boolean;
    pdf_domain: [number, number];
    default_date_range: { start_date: string, end_date: string } | null;
    default_source: number | null;
    formatter_type: FormatterType;
    legend_formatter_type: FormatterType | null;
    decimals: number;
    legend_decimals: number | null;
    order: number;
};


const intervalFromJson = (json: { start_date: string, end_date: string }) =>
    Interval.fromISO(json.start_date + "/" + json.end_date);

export const jsonToMapVisualization = (json: MapVisualizationJson): MapVisualization => {
    const date_ranges_by_source = Object.entries(json.date_ranges_by_source)
        .map(([sourceId, dateRanges]) =>
            [
                parseInt(sourceId),
                dateRanges.map(dateRange => intervalFromJson(dateRange))
            ] as [number, Interval[]])
        .reduce((accumulator, [sourceId, dateRanges]) => {
            accumulator[sourceId] = dateRanges;
            return accumulator;
        }, {} as { [key: number]: Interval[] });
    const default_date_range = json.default_date_range === null ?
        undefined :
        intervalFromJson(json.default_date_range);
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
        should_normalize: json.should_normalize,
        color_palette: json.color_palette,
        reverse_scale: json.reverse_scale,
        invert_normalized: json.invert_normalized,
        scale_type: json.scale_type,
        scale_domain: json.scale_domain,
        date_ranges_by_source,
        sources: json.sources,
        show_pdf: json.show_pdf,
        pdf_domain: json.pdf_domain,
        default_date_range,
        default_source: json.default_source ?? undefined,
        formatter_type: json.formatter_type,
        legend_formatter_type: json.legend_formatter_type ?? undefined,
        decimals: json.decimals,
        legend_decimals: json.legend_decimals ?? undefined,
        order: json.order,
    };
}

export const defaultMapVisualizations: MapVisualizationByTab = {
    [DataTab.RiskMetrics]: {},
    [DataTab.Water]: {},
    [DataTab.Land]: {},
    [DataTab.Climate]: {},
    [DataTab.Economy]: {},
    [DataTab.Demographics]: {},
    [DataTab.ClimateOpinions]: {},
    [DataTab.Energy]: {},
};

export const fetchMapVisualizations = async (): Promise<MapVisualizationByTab | undefined> => {
    const rawJson = await json<{ [key: number]: { [key: number]: MapVisualizationJson } }>("api/map-visualization");
    if (rawJson === undefined) {
        return undefined;
    }
    const mapVisualizationsByTab = Object
        .entries(rawJson)
        .reduce((accumulator, [key, mapVisualizationJsons]) => {
            const mapVisualizations = Object.entries(mapVisualizationJsons)
                .reduce(
                    (accumulator, [key, mapVisualizationJson]) => {
                        accumulator[parseInt(key)] = jsonToMapVisualization(mapVisualizationJson);
                        return accumulator;
                    },
                    {} as { [key in MapVisualizationId]: MapVisualization }
                );
            accumulator[DatabaseToTab.get(parseInt(key))!] = mapVisualizations;
            return accumulator;
        }, {} as MapVisualizationByTab);
    return mapVisualizationsByTab;
};