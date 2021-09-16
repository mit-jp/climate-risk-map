import React, { useEffect, useState } from "react";
import { format } from 'd3';
import { FormatterType, MapVisualization } from "./FullMap";
import Color, { redBlue } from "./Color";
import { Map } from 'immutable';
import { RootState } from "./store";
import { useSelector } from "react-redux";
import Counties from "./Counties";

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
    data: Map<string, number>,
}

const ChoroplethMap = ({ countyPaths }: Props) => {
    const data = useSelector((state: RootState) => state.app.data);
    return (
        <React.Fragment>
            <g
                id="counties"
            >
                {countyPaths.map(({ id, path }) =>
                    <path
                        key={id}
                        fill={redBlue(data[id] || 0)}
                        d={path}
                    />
                )}
            </g>
        </React.Fragment>
    )
}

export default ChoroplethMap;
