import React from "react";
import BubbleMap from "./BubbleMap";
import ChoroplethMap from "./ChoroplethMap";
import dataDefinitions, { DataDefinition, DataGroup, DataIdParams, getUnits, MapType, Normalization, riskMetricFormatter } from "./DataDefinitions";
import { Map } from "immutable";
import { TopoJson } from "./Home";

const getUnitString = (units: string) => units ? ` ${units}` : "";

export const getLegendTitle = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const dataDefinition = selectedDataDefinitions[0];
    const units = getUnits(dataDefinition, selections[0].normalization);
    const unitString = getUnitString(units);
    if (selectedDataDefinitions.length === 1) {
        return unitString;
    } else {
        return "Mean of selected data";
    }
}

const getLegendFormatter = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const normalization = selections[0].normalization;
    switch (normalization) {
        case Normalization.Raw: return selectedDataDefinitions[0].legendFormatter;
        case Normalization.Percentile: return riskMetricFormatter;
    }
}

export const getDataDefinitions = (selections: DataIdParams[]) => {
    return selections.map(selection => dataDefinitions.get(selection.dataGroup)!);
}

type Props = {
    map: TopoJson,
    selections: DataIdParams[],
    data: Map<string, number>,
    detailedView: boolean,
}

const FullMap = ({ map, selections, data, detailedView }: Props) => {
    const firstSelection = selections[0];
    const selectedDataDefinitions = getDataDefinitions(selections);
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
            />;
        case MapType.Bubble:
            return <BubbleMap
                map={map}
                data={data}
                title={title}
                legendFormatter={legendFormatter}
            />;
    }
}

export default FullMap;