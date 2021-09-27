import BubbleMap from "./BubbleMap";
import ChoroplethMap from "./ChoroplethMap";
import { Map } from "immutable";
import { TopoJson } from "./TopoJson";
import { MapType, MapVisualization } from "./MapVisualization";

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

    return isNormalized
        ? selectedMaps.some(value => value.subcategory === 1)
            ? selectedMaps.length > 1
                ? "Combined Risk"
                : "Risk"
            : "Scaled Value"
        : unitString;
}

export enum Aggregation {
    State = "state",
    County = "county",
}

type Props = {
    map: TopoJson,
    selectedMapVisualizations: MapVisualization[],
    data: Map<string, number>,
    detailedView: boolean,
    isNormalized: boolean,
}

const FullMap = ({ map, selectedMapVisualizations, data, detailedView, isNormalized }: Props) => {
    const mapType = selectedMapVisualizations[0]!.map_type;
    const legendTitle = getLegendTitle(selectedMapVisualizations, isNormalized);
    switch (mapType) {
        case MapType.Choropleth:
            return <ChoroplethMap
                map={map}
                selectedMapVisualizations={selectedMapVisualizations}
                data={data}
                detailedView={detailedView}
                legendTitle={legendTitle}
                isNormalized={isNormalized}
            />;
        case MapType.Bubble:
            return <BubbleMap
                map={map}
                data={data}
                legendTitle={legendTitle}
                color={"rgb(34, 139, 69)"}
            />;
    }
}

export default FullMap;
