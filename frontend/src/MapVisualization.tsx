import { Interval } from "luxon";

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
