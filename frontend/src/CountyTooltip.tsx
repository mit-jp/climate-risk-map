import { makeStyles } from "@material-ui/core";
import React from "react";
import counties from "./Counties";
import states, { State } from "./States";
import { getUnitString, MapVisualization, riskMetricFormatter } from "./FullMap";
import { Map } from "immutable";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { selectIsNormalized, selectSelectedMapVisualizations } from "./appSlice";

type StyleProps = {
    shouldShow: boolean,
    position?: { x: number, y: number }
};

const useTooltipStyles = makeStyles({
    root: ({ shouldShow, position }: StyleProps) => ({
        opacity: shouldShow ? 0.95 : 0,
        position: "absolute",
        padding: "4px",
        background: "white",
        pointerEvents: "none",
        left: position?.x,
        top: position?.y,
        zIndex: 100,
    })
});

const getFormatter = (selectedMaps: MapVisualization[], isNormalized: boolean) =>
    isNormalized ?
        riskMetricFormatter :
        selectedMaps[0].formatter;

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
    const tooltipClasses = useTooltipStyles({ shouldShow, position });
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
        <div className={tooltipClasses.root}>
            {text}
        </div>
    );
};

export default CountyTooltip;