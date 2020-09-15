import React, { useRef, useEffect } from 'react';
import { select, geoPath } from 'd3';
import { feature } from 'topojson-client';
import { Objects, Topology, GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';


const Map = ({data}: {data: Topology<Objects<GeoJsonProperties>> | undefined}) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svg = select(svgRef.current);

        if (data === undefined) {
            return;
        }
        const countyGeoJson = feature(
            data,
            data.objects.counties as GeometryCollection<GeoJsonProperties>
        )
        svg.attr("viewBox", "0, 0, 960, 960")
        .attr("id", "map")
            .append("g")
            .attr("id", "map")
            .selectAll("path")
            .data(countyGeoJson.features)
            .join("path")
            .attr("class", "county")
            .attr("d", geoPath())
    }, [data])

    return <svg ref={svgRef}></svg>
}

export default Map;