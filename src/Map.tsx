import React, { useRef, useEffect } from 'react';
import { select, geoPath, scaleThreshold, event} from 'd3';
import { feature } from 'topojson-client';
import { Objects, Topology, GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import dataTypes, { DataName, Data } from './DataTypes';

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

const handleMouseOverCreator = (selection: DataName) => {
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
    
        let this_county = d.properties[DataName[selection]]
        if (this_county) {
            value = this_county;
            name = d.properties.NAME
        }
    
        tooltip.html(`${name}: ${dataTypes.get(selection)?.formatter(value)}`)	
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

const getColor = (selection: DataName) => {
    const dataType: Data | undefined = dataTypes.get(selection);
    if (dataType) {
        const scale = dataType.scale;
        const color = dataType.color[scale.length];
        return scaleThreshold<number, string>()
            .domain(scale)
            .range(color);
    } else {
        throw "No such data type";
    }
}

const Map = ({data, selection}: {data: Topology<Objects<GeoJsonProperties>> | undefined, selection: DataName}) => {
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
        svg
            .select("#map")
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
        <svg ref={svgRef} viewBox="0, 0, 975, 610">
            <g id="map"></g>
        </svg>
    );
}

export default Map;