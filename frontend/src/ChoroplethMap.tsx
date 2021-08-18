import { TopoJson, useThunkDispatch } from "./Home";
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
import { hoverCounty } from "./appSlice";
import { useSelector } from "react-redux";
import { RootState } from "./store";

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
    const { hoverCountyId } = useSelector((state: RootState) => ({ ...state.app }));
    const colorScheme = Color(selections, detailedView);
    const dispatch = useThunkDispatch();
    const color = (countyId: string) => {
        const value = data.get(countyId);
        return colorScheme(value as any) ?? MISSING_DATA_COLOR;
    }
    const path = geoPath();
    const countyFeatures = feature(
        map,
        map.objects.counties as GeometryCollection<GeoJsonProperties>
    ).features;
    const dataDefinitions = getDataDefinitions(selections);
    const ticks = getLegendTicks(dataDefinitions, selections);
    const getArrayOfData = () =>
        Array
            .from(data.valueSeq())
            .filter(value => value !== undefined) as number[];
    const handleCountyMouseOver = (event: React.MouseEvent<SVGPathElement, MouseEvent>, countyId: string) =>
        dispatch(hoverCounty({
            countyId,
            position: {
                x: event.pageX + 20,
                y: event.pageY - 45,
            }
        }));
    return (
        <React.Fragment>
            <g id="counties">
                {countyFeatures.map(county =>
                    <path
                        key={county.id}
                        fill={color(county.id as string)}
                        d={path(county)!}
                        onMouseOver={event => handleCountyMouseOver(event, county.id as string)}
                        opacity={county.id === hoverCountyId ? 0.5 : 1}
                        stroke={county.id === hoverCountyId ? "black" : undefined}
                        strokeWidth={county.id === hoverCountyId ? 0.5 : undefined}
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
