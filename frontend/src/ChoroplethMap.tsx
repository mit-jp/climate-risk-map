import { TopoJson, useThunkDispatch } from "./Home";
import React from "react";
import { Map } from "immutable";
import { DataDefinition, DataGroup, DataIdParams, DataType, Normalization } from "./DataDefinitions";
import { geoPath } from 'd3';
import { feature } from 'topojson-client';
import { GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties, Feature, Geometry } from 'geojson';
import Color from "./Color";
import StateMap from "./StateMap";
import Legend from "./Legend";
import ProbabilityDensity from "./ProbabilityDensity";
import CountyPath from "./CountyPath";
import { generateSelectedDataDefinitions, hoverCounty, hoverPosition } from "./appSlice";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { State } from "./States";

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
    const firstSelection = generateSelectedDataDefinitions(selections)[0];
    if (firstSelection === undefined) {
        return undefined;
    }

    if (firstSelection.type === DataType.ClimateOpinions) {
        return [0, 100] as [number, number];
    }

    return undefined;
}
const path = geoPath();
const getStateFeatures = (map: TopoJson) =>
    feature(
        map,
        map.objects.states as GeometryCollection<GeoJsonProperties>
    ).features.reduce((accumulator, currentValue) => {
        accumulator[currentValue.id as State] = currentValue;
        return accumulator;
    }, {} as { [key in State]: Feature<Geometry, GeoJsonProperties> });

const getCountyFeatures = (map: TopoJson) =>
    feature(
        map,
        map.objects.counties as GeometryCollection<GeoJsonProperties>
    ).features;

const calculateTransform = (state: State | undefined, stateFeatures: { [key in State]: Feature<Geometry, GeoJsonProperties> }) => {
    if (state === undefined) {
        return undefined;
    }
    const width = 900;
    const bounds = path.bounds(stateFeatures[state]),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = .9 / Math.max(dx / width, dy / 610),
        translate = [width / 2 - scale * x, 610 / 2 - scale * y],
        transform = `translate(${translate})scale(${scale})`;
    return transform;
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
    const dispatch = useThunkDispatch();
    const state = useSelector((state: RootState) => state.app.state);
    const colorScheme = Color(selections, detailedView);
    const color = (countyId: string) => {
        const value = data.get(countyId);
        return colorScheme(value as any) ?? MISSING_DATA_COLOR;
    }
    const countyFeatures = getCountyFeatures(map);
    const stateFeatures = getStateFeatures(map);
    const dataDefinitions = generateSelectedDataDefinitions(selections);
    const ticks = getLegendTicks(dataDefinitions, selections);
    const getArrayOfData = () =>
        Array
            .from(data.valueSeq())
            .filter(value => value !== undefined) as number[];
    const onMouseMove = (event: React.MouseEvent<SVGGElement, MouseEvent>) =>
        onMove({ x: event.pageX + 10, y: event.pageY - 25 });
    const onTouchMove = (event: React.TouchEvent<SVGGElement>) =>
        onMove({ x: event.touches[0].pageX + 30, y: event.touches[0].pageY - 45 })
    const onMove = (position: { x: number, y: number }) =>
        dispatch(hoverPosition(position));
    const onHoverEnd = () => dispatch(hoverCounty());
    const transform = calculateTransform(state, stateFeatures);
    return (
        <React.Fragment>
            <g
                id="counties"
                onMouseOut={onHoverEnd}
                onTouchEnd={onHoverEnd}
                onMouseMove={onMouseMove}
                onTouchMove={onTouchMove}
                transform={transform}
            >
                {countyFeatures.map(county =>
                    <CountyPath
                        key={county.id}
                        color={color(county.id as string)}
                        d={path(county)!}
                        id={county.id as string}
                    />
                )}
            </g>
            <StateMap map={map} transform={transform} />
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
