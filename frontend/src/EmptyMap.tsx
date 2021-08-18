import { TopoJson } from "./Home";
import React from 'react';
import { feature } from "topojson-client";
import { geoPath } from "d3";
import { GeoJsonProperties } from 'geojson';
import { GeometryCollection } from 'topojson-specification';

const EmptyMap = ({ map }: { map: TopoJson }) => {
    const nation = feature(
        map,
        map.objects.nation as GeometryCollection<GeoJsonProperties>
    ).features;
    return (
        <g id="nation">
            {nation.map(n =>
                <path
                    key={n.id}
                    d={geoPath()(n)!}
                    stroke="white"
                    fill="#eee"
                    strokeLinejoin="round"
                />
            )}
        </g>
    );
}

export default EmptyMap;
