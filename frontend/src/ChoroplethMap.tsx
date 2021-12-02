import { TopoJson } from "./TopoJson";
import * as React from "react";
import { Map } from "immutable";
import { format, geoPath } from 'd3';
import { feature } from 'topojson-client';
import { GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import Color from "./Color";
import StateMap from "./StateMap";
import Legend from "./Legend";
import ProbabilityDensity from "./ProbabilityDensity";
import { clickCounty } from "./appSlice";
import { ZOOM_TRANSITION } from "./MapWrapper";
import { FormatterType, MapType, MapVisualization } from "./MapVisualization";
import "./ChoroplethMap.css";
import { ForwardedRef, forwardRef } from "react";
import { useThunkDispatch } from "./Home";

const MISSING_DATA_COLOR = "#ccc";

const getLegendTicks = (selectedMaps: MapVisualization[], isNormalized: boolean) =>
    isNormalized ?
        undefined :
        selectedMaps[0].legend_ticks;

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
            case FormatterType.PERCENT:
                return (d: number | { valueOf(): number; }) => format("." + decimals + "%")(d).slice(0, -1);
            case FormatterType.DEFAULT:
            default:
                return format(",." + decimals + "f");
        }
    }
}
const getLegendFormatter = (selectedMaps: MapVisualization[], isNormalized: boolean): Formatter => {
    const firstMap = selectedMaps[0];
    const formatterType = firstMap.legend_formatter_type ?? firstMap.formatter_type;
    const decimals = firstMap.legend_decimals ?? firstMap.decimals;
    return createFormatter(formatterType, decimals, isNormalized);
}

function shouldShowPdf(selectedMaps: MapVisualization[], isNormalized: boolean) {
    const firstSelection = selectedMaps[0];
    if (selectedMaps[0] !== undefined && selectedMaps[0].show_pdf === false) {
        return false;
    }
    if (isNormalized) {
        return selectedMaps.length > 1;
    }
    return firstSelection !== undefined && firstSelection.map_type === MapType.Choropleth;
}

function getPdfDomain(selectedMaps: MapVisualization[]) {
    const firstSelection = selectedMaps[0];
    if (firstSelection === undefined) {
        return undefined;
    }

    return firstSelection.pdf_domain;
}
const path = geoPath();

const getCountyFeatures = (map: TopoJson) =>
    feature(
        map,
        map.objects.counties as GeometryCollection<GeoJsonProperties>
    ).features;

type Props = {
    map: TopoJson,
    selectedMapVisualizations: MapVisualization[],
    data: Map<string, number>,
    detailedView: boolean,
    legendTitle: string,
    isNormalized: boolean,
    transform?: string,
}

const ChoroplethMap = forwardRef((
    {
        map,
        selectedMapVisualizations,
        data,
        detailedView,
        legendTitle,
        isNormalized,
        transform,
    }: Props,
    ref: ForwardedRef<SVGGElement>
) => {
    const dispatch = useThunkDispatch();
    const onCountyClicked = (event: any) => event.target?.id ? dispatch(clickCounty(event.target.id)) : null;
    const colorScheme = Color(isNormalized, detailedView, selectedMapVisualizations[0]);
    const color = (countyId: string) => {
        const value = data.get(countyId);
        return colorScheme(value as any) ?? MISSING_DATA_COLOR;
    }
    const countyFeatures = getCountyFeatures(map);
    const legendTicks = getLegendTicks(selectedMapVisualizations, isNormalized);
    const legendFormatter = getLegendFormatter(selectedMapVisualizations, isNormalized);
    const getArrayOfData = () =>
        Array
            .from(data.valueSeq())
            .filter(value => value !== undefined) as number[];

    return (
        <React.Fragment>
            <g
                id="counties"
                transform={transform}
                style={ZOOM_TRANSITION}
                ref={ref}
            >
                {countyFeatures.map(county =>
                    <path
                        key={county.id}
                        id={county.id as string}
                        fill={color(county.id as string)}
                        d={path(county)!}
                        onClick={onCountyClicked}
                    />
                )}
            </g>
            <StateMap map={map} transform={transform} />
            <Legend
                title={legendTitle}
                color={colorScheme}
                tickFormat={legendFormatter}
                ticks={legendTicks}
                showHighLowLabels={isNormalized}
            />
            {
                shouldShowPdf(selectedMapVisualizations, isNormalized) &&
                <ProbabilityDensity
                    data={getArrayOfData()}
                    map={selectedMapVisualizations[0]}
                    xRange={getPdfDomain(selectedMapVisualizations)}
                    formatter={legendFormatter}
                    continuous={detailedView}
                    shouldNormalize={isNormalized}
                />
            }
        </React.Fragment>
    )
});

export default ChoroplethMap;
