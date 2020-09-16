import React, { useRef, useEffect } from 'react';
import { select, geoPath, scaleThreshold, schemeBlues } from 'd3';
import { feature } from 'topojson-client';
import { Objects, Topology, GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';

const getColor = scaleThreshold<number, string>()
    .domain([0, 1000000, 2000000, 3000000, 10000000, 100000000, 300000000, 700000000])
    .range(schemeBlues[9]);

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
        svg.attr("viewBox", "0, 0, 975, 610")
        .attr("id", "map")
            .append("g")
            .attr("id", "map")
            .selectAll("path")
            .data(countyGeoJson.features)
            .join("path")
            .attr("class", "county")
            .attr("fill", d => {
                if (d.properties) {
                    return getColor(d.properties["GDP2018"]);
                } else {
                    return getColor(0);
                }
            })
            .attr("d", geoPath())
    }, [data])

    return <svg ref={svgRef}></svg>
}

export default Map;