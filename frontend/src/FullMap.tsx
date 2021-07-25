import React from "react";
import BubbleMap from "./BubbleMap";
import ChoroplethMap from "./ChoroplethMap";
import { Map } from "immutable";
import { TopoJson } from "./Home";
import { DatasetId } from "./appSlice";
import { DataSource, MapVisualizationId } from "./DataSelector";
import { format } from "d3";
import { Interval } from "luxon";

export const getUnitString = (units: string) => units ? ` ${units}` : "";

const getUnits = (dataDefinition: MapVisualization, isNormalized: boolean) => {
    return isNormalized ?
        "Normalized value" :
        dataDefinition.units;
}

export const getLegendTitle = (selectedMaps: MapVisualization[], isNormalized: boolean) => {
    const dataDefinition = selectedMaps[0];
    const units = getUnits(dataDefinition, isNormalized);
    const unitString = getUnitString(units);
    if (selectedMaps.length === 1) {
        return unitString;
    } else {
        return "Mean of selected data";
    }
}

export const riskMetricFormatter = (d: number | { valueOf(): number; }) =>
    format(".0%")(d).slice(0, -1);

const getLegendFormatter = (selectedMaps: MapVisualization[], isNormalized: boolean) =>
    isNormalized ?
        riskMetricFormatter :
        selectedMaps[0].legendFormatter;

export enum Aggregation {
    State = "state",
    County = "county",
};
export enum MapType {
    Choropleth = 1,
    Bubble = 2,
};
export type ColorPalette = string;
export type ScaleType = "Diverging" | "Sequential" | "DivergingSymLog" | "Threshold" | "SequentialSqrt";
export type FormatterType = string;
export interface MapVisualization {
    id: MapVisualizationId;
    dataset: DatasetId;
    mapType: MapType;
    subcategory: number;
    units: string;
    shortName: string;
    name: string;
    description: string;
    legendTicks?: number;
    shouldNormalize: boolean;
    colorPalette: ColorPalette;
    reverseScale: boolean;
    invertNormalized: boolean;
    scaleType: ScaleType;
    scaleDomain: number[];
    dateRangesBySource: { [key: number]: Interval[] };
    sources: { [key: number]: DataSource };
    showPdf: boolean;
    pdfDomain?: [number, number];
    defaultDateRange?: Interval;
    defaultDataSource?: number;
    formatter: (n: number | { valueOf(): number }) => string;
    legendFormatter: (n: number | { valueOf(): number }) => string;
};


type Props = {
    map: TopoJson,
    selectedMapVisualizations: MapVisualization[],
    data: Map<string, number>,
    detailedView: boolean,
    isNormalized: boolean,
}

const FullMap = ({ map, selectedMapVisualizations, data, detailedView, isNormalized }: Props) => {
    const mapType = selectedMapVisualizations[0]!.mapType;
    const title = getLegendTitle(selectedMapVisualizations, isNormalized);
    const legendFormatter = getLegendFormatter(selectedMapVisualizations, isNormalized);
    switch (mapType) {
        case MapType.Choropleth:
            return <ChoroplethMap
                map={map}
                selectedMapVisualizations={selectedMapVisualizations}
                data={data}
                detailedView={detailedView}
                title={title}
                legendFormatter={legendFormatter}
                isNormalized={isNormalized}
            />;
        case MapType.Bubble:
            return <BubbleMap
                map={map}
                data={data}
                title={title}
                color={"rgb(34, 139, 69)"}
            />;
    }
}

export default FullMap;