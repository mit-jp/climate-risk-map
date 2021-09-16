import React from "react";
import { format } from 'd3';
import { FormatterType, MapVisualization } from "./FullMap";
import Color, { redBlue } from "./Color";
import { Map } from 'immutable';

const MISSING_DATA_COLOR = "#ccc";

export type Formatter = (n: number | { valueOf(): number }) => string;

export const riskMetricFormatter = (d: number | { valueOf(): number; }) =>
    format(".0%")(d).slice(0, -1);

export const createFormatter = (formatterType: FormatterType, decimals: number, isNormalized: boolean) => {
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
}

type Props = {
    countyPaths: { path: string, id: string }[],
    isNormalized: boolean,
    detailedView: boolean,
    mapVisualization: MapVisualization | undefined,
    data: Map<string, number>,
}

const ChoroplethMap = ({ countyPaths, isNormalized, detailedView, mapVisualization, data }: Props) => {
    const colorScheme = mapVisualization
        ? Color(isNormalized, detailedView, mapVisualization)
        : redBlue;
    const color = (countyId: string) => {
        const value = data.get(countyId);
        return colorScheme(value as any) ?? MISSING_DATA_COLOR;
    }
    return (
        <React.Fragment>
            <g
                id="counties"
            >
                {countyPaths.map(({ id, path }) =>
                    <path
                        key={id}
                        fill={color(id)}
                        d={path}
                    />
                )}
            </g>
        </React.Fragment>
    )
}

export default ChoroplethMap;
