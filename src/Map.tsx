import React, { useRef, useEffect } from 'react';
import { select, geoPath, scaleThreshold, schemeBlues, event} from 'd3';
import { feature } from 'topojson-client';
import { Objects, Topology, GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';

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
    
        tooltip.html(`${name}: ${new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value)}`)	
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

const getColor = scaleThreshold<number, string>()
    .domain([0, 1000000, 2000000, 3000000, 10000000, 100000000, 300000000, 700000000])
    .range(schemeBlues[9]);

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
                    return getColor(d.properties[selection]);
                } else {
                    return getColor(0);
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