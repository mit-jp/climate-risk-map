import { TopoJson, useThunkDispatch } from "./Home";
import React from "react";
import { Map } from "immutable";
import { geoPath } from 'd3';
import { feature } from 'topojson-client';
import { GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import Color from "./Color";
import StateMap from "./StateMap";
import Legend from "./Legend";
import ProbabilityDensity from "./ProbabilityDensity";
import CountyPath from "./CountyPath";
import { hoverCounty, hoverPosition, selectMapTransform } from "./appSlice";
import { useSelector } from "react-redux";
import { ZOOM_TRANSITION } from "./MapWrapper";
import { MapType, MapVisualization } from "./FullMap";

const MISSING_DATA_COLOR = "#ccc";

const getLegendTicks = (selectedMaps: MapVisualization[], isNormalized: boolean) =>
    isNormalized ?
        undefined :
        selectedMaps[0].legendTicks;

function shouldShowPdf(selectedMaps: MapVisualization[], isNormalized: boolean) {
    const firstSelection = selectedMaps[0];
    if (selectedMaps[0] !== undefined && selectedMaps[0].showPdf === false) {
        return false;
    }
    if (isNormalized) {
        return selectedMaps.length > 1;
    }
    return firstSelection !== undefined && firstSelection.mapType === MapType.Choropleth;
}

function getPdfDomain(selectedMaps: MapVisualization[]) {
    const firstSelection = selectedMaps[0];
    if (firstSelection === undefined) {
        return undefined;
    }

    return firstSelection.pdfDomain;
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
    title: string,
    legendFormatter: (n: number | {
        valueOf(): number;
    }) => string,
    isNormalized: boolean,
}

const ChoroplethMap = ({ map, selectedMapVisualizations, data, detailedView, title, legendFormatter, isNormalized }: Props) => {
    const dispatch = useThunkDispatch();
    const transform = useSelector(selectMapTransform);
    const colorScheme = Color(isNormalized, detailedView, selectedMapVisualizations[0]);
    const color = (countyId: string) => {
        const value = data.get(countyId);
        return colorScheme(value as any) ?? MISSING_DATA_COLOR;
    }
    const countyFeatures = getCountyFeatures(map);
    const ticks = getLegendTicks(selectedMapVisualizations, isNormalized);
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

    return (
        <React.Fragment>
            <g
                id="counties"
                onMouseOut={onHoverEnd}
                onTouchEnd={onHoverEnd}
                onMouseMove={onMouseMove}
                onTouchMove={onTouchMove}
                transform={transform}
                style={ZOOM_TRANSITION}
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
}

export default ChoroplethMap;
