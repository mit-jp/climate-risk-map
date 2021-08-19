import { TopoJson } from "./Home";
import React from 'react';
import { feature } from "topojson-client";
import { geoPath } from "d3";
import { GeoJsonProperties } from 'geojson';
import { GeometryCollection } from 'topojson-specification';
import { selectMapTransform } from "./appSlice";
import { useSelector } from "react-redux";
import { ZOOM_TRANSITION } from "./MapWrapper";

const EmptyMap = ({ map }: { map: TopoJson }) => {
    const transform = useSelector(selectMapTransform);
    const nation = feature(
        map,
        map.objects.nation as GeometryCollection<GeoJsonProperties>
    ).features;
    return (
        <g id="nation" transform={transform} style={ZOOM_TRANSITION}>
            {nation.map(n =>
                <path
                    key={"nation"}
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
