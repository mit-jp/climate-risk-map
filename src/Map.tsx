import React, { useRef, useEffect } from 'react';
import { select, geoPath, scaleThreshold, schemeBlues, event} from 'd3';
import { feature } from 'topojson-client';
import { Objects, Topology, GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import dataTypes from './DataTypes';

const tooltip = select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("font-size", "0.7em")
    .style("font-family", "sans-serif")
    .style("font-weight", 600)
    .style("padding", "4px")
    .style("background", "white")	
    .style("pointer-events", "none");

const handleMouseOverCreator = (selection: string) => {
    return function(this: any, d: any) {
        select(this)
            .style("opacity", 0.5)
            .style("stroke", "black")
            .style("stroke-width", 0.5)
    
        tooltip.transition()
            .duration(200)
            .style("opacity", .9)
        
        let value = 0
        let name = "---"
    
        let this_county = d.properties[selection]
        if (this_county) {
            value = this_county;
            name = d.properties.NAME
        }
    
        tooltip.html(`${name}: ${dataTypes[selection].formatter(value)}`)	
            .style("left", `${event.pageX + 20}px`)		
            .style("top", (event.pageY - 45) + "px");
    }
};

const handleMouseOut = function(this:any, d:any) {
    select(this)
        .style("opacity", 1)
        .style("stroke", null)

    tooltip.transition()		
        .duration(200)		
        .style("opacity", 0)
}

const getColor = (selection: string) => {
    const scale = dataTypes[selection].scale;
    const color = dataTypes[selection].color[scale.length];
    return scaleThreshold<number, string>()
        .domain(scale)
        .range(color);
}

const Map = ({data, selection}: {data: Topology<Objects<GeoJsonProperties>> | undefined, selection: string}) => {
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
            .append("g")
            .attr("id", "map")
            .selectAll("path")
            .data(countyGeoJson.features)
            .join("path")
            .attr("class", "county")
            .attr("fill", d => {
                if (d.properties) {
                    return getColor(selection)(d.properties[selection]);
                } else {
                    return getColor(selection)(0);
                }
            })
            .attr("d", geoPath());
        svg
            .selectAll(".county")
            .on("touchmove mousemove", handleMouseOverCreator(selection))
            .on("touchend mouseleave", handleMouseOut);
    }, [data, selection])

    return (
        <svg ref={svgRef}></svg>
    );
}

export default Map;