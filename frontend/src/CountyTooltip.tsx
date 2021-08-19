import { makeStyles } from "@material-ui/core";
import React from "react";
import counties from "./Counties";
import states, { State } from "./States";
import { DataDefinition, DataIdParams, getUnits, Normalization, riskMetricFormatter } from "./DataDefinitions";
import { getUnitString } from "./FullMap";
import { Map } from "immutable";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { selectDataDefinitions, selectSelections } from "./appSlice";

type StyleProps = {
    shouldShow: boolean,
    position?: { x: number, y: number }
};

const useTooltipStyles = makeStyles({
    root: ({ shouldShow, position }: StyleProps) => ({
        opacity: shouldShow ? 0.95 : 0,
        transition: "opacity 0.2s ease-in-out",
        position: "absolute",
        padding: "4px",
        background: "white",
        pointerEvents: "none",
        left: position?.x,
        top: position?.y,
        zIndex: 100,
    })
});

const getFormatter = (dataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const normalization = selections[0].normalization;
    switch (normalization) {
        case Normalization.Raw: return dataDefinitions[0].formatter;
        case Normalization.Percentile: return riskMetricFormatter;
    }
}

const format = (value: number | undefined, dataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const formatter = getFormatter(dataDefinitions, selections);
    if (value === undefined) {
        return "No data";
    }
    if (selections[0].normalization !== Normalization.Raw) {
        return formatter(value);
    } else {
        let units = getUnits(dataDefinitions[0], selections[0].normalization);
        return formatter(value) + getUnitString(units);
    }
}

const CountyTooltip = ({ data }: { data: Map<string, number> }) => {
    const selections = useSelector(selectSelections);
    const countyId = useSelector((state: RootState) => state.app.hoverCountyId);
    const position = useSelector((state: RootState) => state.app.hoverPosition);
    const dataDefinitions = useSelector(selectDataDefinitions);
    const shouldShow = countyId !== undefined;
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
        text = `${name}: ${format(value, dataDefinitions, selections)}`;
    }

    return (
        <div className={tooltipClasses.root}>
            {text}
        </div>
    );
};

export default CountyTooltip;