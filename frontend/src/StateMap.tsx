import { TopoJson } from "./Home";
import React from "react";
import { geoPath } from "d3";
import { GeometryCollection } from 'topojson-specification';
import { mesh } from "topojson-client";

const StateMap = ({ map, transform }: { map: TopoJson, transform?: string }) => (
    <g
        id="states"
        transform={transform}
    >
        <path
            d={geoPath()(mesh(
                map,
                map.objects.states as GeometryCollection,
                (a, b) => a !== b
            ))!}
            stroke="white"
            fill="none"
            strokeLinejoin="round"
        />
    </g>
);
export default StateMap;