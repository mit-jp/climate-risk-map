import React, { useEffect } from "react";
import BubbleMap from "./BubbleMap";
import ChoroplethMap from "./ChoroplethMap";
import { Map } from "immutable";
import { TopoJson, useThunkDispatch } from "./Home";
import { Data, DataByDataset, setData } from "./appSlice";
import { DataSource, MapSelection, MapVisualizationId } from "./DataSelector";
import { autoType, csv, DSVParsedArray } from "d3";
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
export enum FormatterType {
    MONEY = 1,
    NEAREST_SI_UNIT = 2,
    DEFAULT = 3,
};
export interface MapVisualization {
    id: MapVisualizationId;
    dataset: number;
    map_type: MapType;
    subcategory?: number;
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
    date_ranges_by_source: { [key: number]: Interval[] };
    sources: { [key: number]: DataSource };
    show_pdf: boolean;
    pdf_domain?: [number, number];
    default_date_range?: Interval;
    default_source?: number;
    formatter_type: FormatterType;
    legend_formatter_type?: FormatterType;
    decimals: number;
    legend_decimals?: number;
};

const mergeFIPSCodes = (csv: DSVParsedArray<Data>): [string, Data][] =>
    csv.map(row => {
        let stateId = row["state_id"]!.toString();
        let countyId = row["county_id"]!.toString();
        delete row["state_id"];
        delete row["county_id"];
        stateId = "0".repeat(2 - stateId.length) + stateId;
        countyId = "0".repeat(3 - countyId.length) + countyId;
        return [stateId + countyId, row];
    });


type Props = {
    map: TopoJson,
    selectedMapVisualizations: MapVisualization[],
    mapVisualizations: { [key in MapVisualizationId]: MapVisualization },
    selections: MapSelection[],
    data: Map<string, number>,
    detailedView: boolean,
    isNormalized: boolean,
}

const FullMap = ({ map, selectedMapVisualizations, mapVisualizations, selections, data, detailedView, isNormalized }: Props) => {
    const dispatch = useThunkDispatch();
    useEffect(() => {
        const loadingCsvs = selections.map(selection => {
            const dataset = mapVisualizations[selection.mapVisualization].dataset;
            const dateRange = selection.dateRange.toISODate();
            return csv<Data>("api/data/" + dataset + "?dateRange=" + dateRange, autoType);
        });
        Promise.all(loadingCsvs).then(loadedCsvs => {
            const dataMaps = loadedCsvs.map(mergeFIPSCodes).map(Map);
            const allData = Map<string, Data>().mergeDeep(...dataMaps)
            dispatch(setData(allData.toJS() as DataByDataset));
        })
    }, [dispatch, mapVisualizations, selections]);
    const mapType = selectedMapVisualizations[0]!.map_type;
    const title = getLegendTitle(selectedMapVisualizations, isNormalized);
    switch (mapType) {
        case MapType.Choropleth:
            return <ChoroplethMap
                map={map}
                selectedMapVisualizations={selectedMapVisualizations}
                data={data}
                detailedView={detailedView}
                title={title}
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