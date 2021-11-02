import { format } from "d3";
import type { MapConfig } from "./MapConfigApi";
import { FormatterType } from "./MapConfigApi";

type Formatter = (n: number | { valueOf(): number }) => string;

export const getUnitString = (units: string) => units ? ` ${units}` : "";

const getUnits = (dataDefinition: MapConfig, isNormalized: boolean) => {
    return isNormalized ?
        "Normalized value" :
        dataDefinition.units;
}

export const getLegendTitle = (selectedMaps: MapConfig[], isNormalized: boolean) => {
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

export const getLegendTicks = (mapConfig: MapConfig, isNormalized: boolean) =>
    isNormalized ? undefined : mapConfig.legend_ticks;

export const getLegendFormatter = (
    selectedMaps: MapConfig[],
    isNormalized: boolean
): Formatter => {
    const firstMap = selectedMaps[0];
    const formatterType =
        firstMap.legend_formatter_type ?? firstMap.formatter_type;
    const decimals = firstMap.legend_decimals ?? firstMap.decimals;
    return createFormatter(formatterType, decimals, isNormalized);
};

export const riskMetricFormatter = (d: number | { valueOf(): number }) =>
    format(".0%")(d).slice(0, -1);

export const createFormatter = (
    formatterType: FormatterType,
    decimals: number,
    isNormalized: boolean
) => {
    if (isNormalized) {
        return riskMetricFormatter;
    } else {
        switch (formatterType) {
            case FormatterType.MONEY:
                return format("$,." + decimals + "s");
            case FormatterType.NEAREST_SI_UNIT:
                return format("~s");
            case FormatterType.DEFAULT:
            default:
                return format(",." + decimals + "f");
        }
    }
};

export const ramp = (color: any, n = 256) => {
    var canvas = document.createElement("canvas");
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    if (context) {
        for (let i = 0; i < n; ++i) {
            context.fillStyle = color(i / (n - 1));
            context.fillRect(i, 0, 1, 1);
        }
    }
    return canvas;
}