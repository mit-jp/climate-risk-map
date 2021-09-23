import counties from "./Counties";
import states, { State } from "./States";
import { getUnitString } from "./FullMap";
import { MapVisualization } from "./MapVisualization";
import { Map } from "immutable";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { selectIsNormalized, selectSelectedMapVisualizations } from "./appSlice";
import { createFormatter, Formatter } from "./ChoroplethMap";

const getFormatter = (selectedMaps: MapVisualization[], isNormalized: boolean): Formatter =>
    createFormatter(selectedMaps[0].formatter_type, selectedMaps[0].decimals, isNormalized);


const getUnits = (dataDefinition: MapVisualization, isNormalized: boolean) =>
    isNormalized ?
        "Normalized value" :
        dataDefinition.units;

const formatData = (
    value: number | undefined,
    selectedMaps: MapVisualization[],
    isNormalized: boolean,
) => {
    const formatter = getFormatter(selectedMaps, isNormalized);
    if (value === undefined) {
        return "No data";
    }
    if (isNormalized) {
        return formatter(value);
    } else {
        let units = getUnits(selectedMaps[0], isNormalized);
        return formatter(value) + getUnitString(units);
    }
}

const CountyTooltip = ({ data }: { data: Map<string, number> }) => {
    const selectedMapVisualizations = useSelector(selectSelectedMapVisualizations);
    const countyId = useSelector((state: RootState) => state.app.hoverCountyId);
    const position = useSelector((state: RootState) => state.app.hoverPosition);
    const isNormalized = useSelector(selectIsNormalized);
    const shouldShow = countyId !== undefined && position !== undefined;
    let text = "";
    if (countyId) {
        const county = counties.get(countyId);
        const state = states.get(countyId.slice(0, 2) as State);
        let name = "---";
        if (state && county) {
            name = county + ", " + state;
        }
        const value = data.get(countyId);
        text = `${name}: ${formatData(value, selectedMapVisualizations, isNormalized)}`;
    }

    return (
        <div style={{
            opacity: shouldShow ? 0.95 : 0,
            position: "absolute",
            padding: "4px",
            background: "white",
            pointerEvents: "none",
            left: position?.x,
            top: position?.y,
            zIndex: 100,
        }}>
            {text}
        </div>
    );
};

export default CountyTooltip;