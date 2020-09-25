import React, { useRef, useEffect } from 'react';
import { select, geoPath, event } from 'd3';
import { feature } from 'topojson-client';
import { Objects, Topology, GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import dataTypes, { DataName } from './DataTypes';
import { legendColor } from 'd3-svg-legend';

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
        if (this_county === 0 || this_county) {
            value = this_county;
            name = d.properties.County_Sta.replace("_", ", ")
        }
        const dataType = dataTypes.get(selection)!;

        tooltip.html(`${name}: ${dataType.formatter(value) + getUnitString(dataType.units)}`)	
            .style("left", `${event.pageX + 20}px`)		
            .style("top", (event.pageY - 45) + "px");
    }
};

const getUnitString = (units: string) => units ? ` ${units}` : "";
const getUnitStringWithParens = (units: string) => units ? ` (${units})` : "";

const handleMouseOut = function(this:any, d:any) {
    select(this)
        .style("opacity", 1)
        .style("stroke", null)

    tooltip.transition()		
        .duration(200)		
        .style("opacity", 0)
}

const Map = ({data, selection}: {data: Topology<Objects<GeoJsonProperties>> | undefined, selection: DataName}) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const dataType = dataTypes.get(selection)!;
        const svg = select(svgRef.current);

        if (data === undefined) {
            return;
        }
        const countyGeoJson = feature(
            data,
            data.objects.counties as GeometryCollection<GeoJsonProperties>
        )

        // legend
        const legendSequential = legendColor()
            .cells(5)
            .shapeWidth(20)
            .shapeHeight(30)
            .shapePadding(0)
            .titleWidth(200)
            .title(dataType.name + getUnitStringWithParens(dataType.units))
            .labelFormat(dataType.formatter)
            .orient("vertical")
            .scale(dataType.color)

        svg.select<SVGGElement>("#legend")
            .attr("transform", "translate(925, 320)")
            // @ts-ignore
            .call(legendSequential)

        // colorized counties
        svg.select("#map")
            .selectAll("path")
            .data(countyGeoJson.features)
            .join("path")
            .attr("class", "county")
            .attr("fill", d => {
                if (d.properties) {
                    return dataType.color(d.properties[DataName[selection]]);
                } else {
                    return dataType.color(NaN);
                }
            })
            .attr("d", geoPath());

        // tooltips
        svg
            .selectAll(".county")
            .on("touchmove mousemove", handleMouseOverCreator(selection))
            .on("touchend mouseleave", handleMouseOut);
        
        console.log("TESTING THIS FOR LOOPS")
    }, [data, selection])

    return (
        <svg ref={svgRef} viewBox="0, 0, 1175, 610">
            <g id="legend"></g>
            <g id="map"></g>
        </svg>
    );
}

export default Map;