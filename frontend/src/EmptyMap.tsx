import { TopoJson } from "./Home";
import React from 'react';
import { feature } from "topojson-client";
import { geoPath } from "d3";
import { GeoJsonProperties } from 'geojson';
import { GeometryCollection } from 'topojson-specification';
import { useSelector } from "react-redux";
import { ZOOM_TRANSITION } from "./MapWrapper";

const EmptyMap = ({ map }: { map: TopoJson }) => {
    const nation = feature(
        map,
        map.objects.nation as GeometryCollection<GeoJsonProperties>
    ).features;
    return null;
}

export default EmptyMap;
