import { TopoJson } from "./Home";
import React from "react";
import { Map } from "immutable";
import { DataDefinition, DataGroup, DataIdParams, DataType, Normalization } from "./DataDefinitions";
import { geoPath } from 'd3';
import { feature } from 'topojson-client';
import { GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import Color from "./Color";
import StateMap from "./StateMap";
import Legend from "./Legend";
import { getDataDefinitions } from "./FullMap";
import ProbabilityDensity from "./ProbabilityDensity";

const MISSING_DATA_COLOR = "#ccc";


const getLegendTicks = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const normalization = selections[0].normalization;
    switch (normalization) {
        case Normalization.Raw: return selectedDataDefinitions[0].legendTicks;
        case Normalization.Percentile: return undefined;
    }
}

const shouldShowPdf = (selection: DataIdParams, numSelections: number) => {
    if (selection.dataGroup === DataGroup.Populationpersquaremile2010) {
        return false;
    }
    if (selection.normalization === Normalization.Percentile) {
        return numSelections > 1;
    }
    return true;
}

const getPdfDomain = (selections: DataIdParams[]) => {
    const firstSelection = getDataDefinitions(selections)[0];
    if (firstSelection === undefined) {
        return undefined;
    }

    if (firstSelection.type === DataType.ClimateOpinions) {
        return [0, 100] as [number, number];
    }

    return undefined;
}

type Props = {
    map: TopoJson,
    selections: DataIdParams[],
    data: Map<string, number>,
    detailedView: boolean,
    title: string,
    legendFormatter: (n: number | {
        valueOf(): number;
    }) => string,
}

const ChoroplethMap = ({ map, selections, data, detailedView, title, legendFormatter }: Props) => {
    const colorScheme = Color(selections, detailedView);
    const color = (countyId: string) => {
        const value = data.get(countyId);
        return colorScheme(value as any) ?? MISSING_DATA_COLOR;
    }
    const path = geoPath();
    const counties = feature(
        map,
        map.objects.counties as GeometryCollection<GeoJsonProperties>
    ).features;
    const ticks = getLegendTicks(getDataDefinitions(selections), selections);
    const getArrayOfData = () =>
        Array
            .from(data.valueSeq())
            .filter(value => value !== undefined) as number[];

    return (
        <React.Fragment>
            <g id="counties">
                {counties.map(county =>
                    <path
                        key={county.id}
                        fill={color(county.id as string)}
                        d={path(county)!}
                    />
                )}
            </g>
            <StateMap map={map} />
            <Legend
                title={title}
                color={colorScheme}
                tickFormat={legendFormatter}
                ticks={ticks} />
            {
                shouldShowPdf(selections[0], selections.length) &&
                <ProbabilityDensity
                    data={getArrayOfData()}
                    selections={selections}
                    xRange={getPdfDomain(selections)}
                    formatter={legendFormatter}
                    continuous={detailedView}
                />
            }
        </React.Fragment>
    )
}

export default ChoroplethMap;
