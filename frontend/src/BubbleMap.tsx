import { TopoJson } from "./Home";
import React from "react";
import { Map } from "immutable";
import { geoPath, max, ScalePower, scaleSqrt } from 'd3';
import { feature } from 'topojson-client';
import { GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties, Geometry, Feature } from 'geojson';
import StateMap from "./StateMap";
import EmptyMap from "./EmptyMap";
import BubbleLegend from "./BubbleLegend";

type Props = {
    map: TopoJson,
    data: Map<string, number>,
    title: string,
    legendFormatter: (n: number | {
        valueOf(): number;
    }) => string,
}

const BubbleMap = ({ map, data, title, legendFormatter }: Props) => {
    const path = geoPath();
    const counties = feature(
        map,
        map.objects.counties as GeometryCollection<GeoJsonProperties>
    ).features;
    const valueToRadius = makeValueToRadius(counties, data);
    const countyToRadius = makeCountyToRadius(valueToRadius, data);

    return (
        <React.Fragment>
            <EmptyMap map={map} />
            <StateMap map={map} />
            <g id="bubbles">
                {counties.map(county =>
                    <circle
                        key={county.id}
                        transform={`translate(${path.centroid(county)})`}
                        r={countyToRadius(county)}
                        stroke={"#fff"}
                        fill={"rgb(34, 139, 69)"}
                        strokeOpacity={0.5}
                        fillOpacity={0.5}
                    />
                )}
            </g>
            <BubbleLegend radius={valueToRadius} title={title} />
        </React.Fragment>
    )
}

function makeValueToRadius(
    counties: Feature<Geometry, GeoJsonProperties>[],
    data: Map<string, number | undefined>,
): ScalePower<number, number, never> {
    let radius: ScalePower<number, number, never>;
    if (data !== undefined) {
        const values = counties.map(d => data.get(d.id as string)).filter(d => d !== undefined).map(d => d as number);
        radius = scaleSqrt([0, max(values) ?? 0], [0, 40]);
    } else {
        radius = scaleSqrt([0, 0], [0, 40]);
    }
    return radius;
}

const makeCountyToRadius = (
    valueToRadius: ScalePower<number, number, never>,
    data: Map<string, number | undefined>,
) =>
    (county: Feature<Geometry, GeoJsonProperties>) => {
        const value = data.get(county.id as string) ?? 0;
        return valueToRadius(value);
    };


export default BubbleMap;
