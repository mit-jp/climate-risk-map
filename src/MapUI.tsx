import React, { useRef, useEffect } from 'react';
import { select, geoPath, event } from 'd3';
import { feature, mesh } from 'topojson-client';
import { Objects, Topology, GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import DataDescription from './DataDescription';
import dataDefinitions, { DataDefinition, DataIdParams, DataId } from './DataDefinitions';
import { legendColor } from 'd3-svg-legend';

const missingDataColor = "#ccc";

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

const handleMouseOverCreator = (selection: DataId, dataType: DataDefinition) => {
    return function(this: any, d: any) {
        select(this)
            .style("opacity", 0.5)
            .style("stroke", "black")
            .style("stroke-width", 0.5)
    
        tooltip.transition()
            .duration(200)
            .style("opacity", .9)
        
        let name = d.properties.County_Sta.replace("_", ", ") ?? "---";
        let value = d.properties[DataId[selection]];

        tooltip.html(`${name}: ${format(value, dataType)}`)	
            .style("left", `${event.pageX + 20}px`)		
            .style("top", (event.pageY - 45) + "px");
    }
};

const format = (value: number | undefined, dataType: DataDefinition) => {
    if (value === undefined) {
        return "No data";
    }
    return dataType.formatter(value) + getUnitString(dataType.units);
}

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

const MapUI = ({data, selection}: {data: Topology<Objects<GeoJsonProperties>> | undefined, selection: DataIdParams}) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const dataType = dataDefinitions.get(selection.dataGroup)!;
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
        svg.select("#counties")
            .selectAll("path")
            .data(countyGeoJson.features)
            .join("path")
            .attr("class", "county")
            .attr("fill", d => {
                if (d.properties) {
                    const dataId = dataType.id(selection);
                    const value = d.properties[DataId[dataId]];
                    return dataType.color(value) ?? missingDataColor;
                } else {
                    return missingDataColor;
                }
            })
            .attr("d", geoPath());

        // state borders
        svg.select("#states")
            .select("path")
            .datum(mesh(data, data.objects.states as GeometryCollection))
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("d", geoPath());

        // tooltips
        svg
            .selectAll(".county")
            .on("touchmove mousemove", handleMouseOverCreator(dataType.id(selection), dataType))
            .on("touchend mouseleave", handleMouseOut);
    }, [data, selection])

    return (
        <div id="map">
        <svg ref={svgRef} viewBox="0, 0, 1175, 610">
            <g id="legend"></g>
            <g id="counties"></g>
            <g id="states"><path /></g>
        </svg>
        <DataDescription selection={selection} />
        </div>
    );
}

export default MapUI;