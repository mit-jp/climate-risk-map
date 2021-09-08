import React from "react";
import BubbleMap from "./BubbleMap";
import ChoroplethMap from "./ChoroplethMap";
import dataDefinitions, { DataDefinition, DataIdParams, DataType, getUnits, isDemographics, MapType, Normalization, riskMetricFormatter } from "./DataDefinitions";
import { Map } from "immutable";
import { TopoJson } from "./Home";
import { generateSelectedDataDefinitions } from "./appSlice";

export const getUnitString = (units: string) => units ? ` ${units}` : "";

export const getLegendTitle = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const dataDefinition = selectedDataDefinitions[0];
    const units = getUnits(dataDefinition, selections[0].normalization);
    const unitString = getUnitString(units);
    const numSelectedRiskMetrics = selectedDataDefinitions.filter(d => !isDemographics(d.type)).length;

    if (selectedDataDefinitions.length === 1 || numSelectedRiskMetrics === 0) {
        return unitString;
    } else {
        return "Combined Risk";
    }
}

const getLegendFormatter = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const normalization = selections[0].normalization;
    switch (normalization) {
        case Normalization.Raw: return selectedDataDefinitions[0].legendFormatter;
        case Normalization.Percentile: return riskMetricFormatter;
    }
}

type Props = {
    map: TopoJson,
    selections: DataIdParams[],
    data: Map<string, number>,
    detailedView: boolean,
}

const FullMap = ({ map, selections, data, detailedView }: Props) => {
    const firstSelection = selections[0];
    const isNormalized = firstSelection.normalization !== Normalization.Raw;
    const selectedDataDefinitions = generateSelectedDataDefinitions(selections);
    const mapType = dataDefinitions.get(firstSelection.dataGroup)!.mapType;
    const title = getLegendTitle(selectedDataDefinitions, selections);
    const legendFormatter = getLegendFormatter(selectedDataDefinitions, selections);
    switch (mapType) {
        case MapType.Choropleth:
            return <ChoroplethMap
                map={map}
                selections={selections}
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
                color={selectedDataDefinitions[0].type === DataType.Health ? "black" : "rgb(34, 139, 69)"}
            />;
    }
}

export default FullMap;