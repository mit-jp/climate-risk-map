import React, { useRef, useEffect } from 'react';
import { select, geoPath, event, mean } from 'd3';
import { Feature, Geometry } from 'geojson';
import { feature, mesh } from 'topojson-client';
import { Objects, Topology, GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import DataDescription from './DataDescription';
import dataDefinitions, { DataDefinition, DataIdParams, DataId } from './DataDefinitions';
import { legendColor } from 'd3-svg-legend';
import DatasetDescription from './DatasetDescription';
import { Map } from 'immutable';

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

const handleMouseOverCreator = (selectedDataDefinitions: DataDefinition[], processedData: Map<number, number | undefined>) => {
    return function(this: any, d: any) {
        select(this)
            .style("opacity", 0.5)
            .style("stroke", "black")
            .style("stroke-width", 0.5)
    
        tooltip.transition()
            .duration(200)
            .style("opacity", .9)
        
        let name = d.properties.County_Sta.replace("_", ", ") ?? "---";
        let value = processedData.get(d.id);

        tooltip.html(`${name}: ${format(value, selectedDataDefinitions)}`)	
            .style("left", `${event.pageX + 20}px`)		
            .style("top", (event.pageY - 45) + "px");
    }
};

const format = (value: number | undefined, selectedDataDefinitions: DataDefinition[]) => {
    const formatter = getFormatter(selectedDataDefinitions);
    if (value === undefined) {
        return "No data";
    }
    if (selectedDataDefinitions.length === 1) {
        return formatter(value) + getUnitString(selectedDataDefinitions[0].units);
    } else {
        return formatter(value);
    }
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

type Props = {
    data: Topology<Objects<GeoJsonProperties>> | undefined,
    selections: DataIdParams[],
    showDatasetDescription: boolean,
    onDatasetDescriptionClicked: () => void,
    showDataDescription: boolean,
    onDataDescriptionClicked: () => void,
};

const getDataset = (selection: DataIdParams) => {
    // get the selected dataset, or the first one, if there's none selected
    return selection.dataset ?? dataDefinitions.get(selection.dataGroup)!.datasets[0];
}   

const getDataDefinitions = (selections: DataIdParams[]) => {
    return selections.map(selection => dataDefinitions.get(selection.dataGroup)!);
}

const getDataIds = (selections: DataIdParams[]) => {
    return selections.map(selection => dataDefinitions.get(selection.dataGroup)!.id(selection));
}

const getTitle = (selectedDataDefinitions: DataDefinition[]) => {
    if (selectedDataDefinitions.length === 1) {
        const dataDefinition = selectedDataDefinitions[0];
        return dataDefinition.name + getUnitStringWithParens(dataDefinition.units);
    } else {
        const names = selectedDataDefinitions.map(dataDefinition => dataDefinition.name);
        return "Mean of " + names.join(", ");
    }
}

const getFormatter = (selectedDataDefinitions: DataDefinition[]) => {
    return selectedDataDefinitions[0].formatter;
}

const getColorScheme = (selectedDataDefinitions: DataDefinition[]) => {
    return selectedDataDefinitions[0].color;
}

const getProcessedData = (dataIds: DataId[], features: Feature<Geometry, GeoJsonProperties>[]) => {
    return Map(features.map(feature => {
        let value = undefined;
        if (feature.properties) {
            const values = [];
            for (const dataId of dataIds) {
                values.push(feature.properties[DataId[dataId]]);
            }
            value = mean(values);
        }
        return [feature.id as number, value];
    }));
}


const MapUI = ({data, selections, showDatasetDescription, onDatasetDescriptionClicked, showDataDescription, onDataDescriptionClicked}: Props) => {
    const svgRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        if (data === undefined || selections.length === 0) {
            return;
        }

        const features = feature(
            data,
            data.objects.counties as GeometryCollection<GeoJsonProperties>
        ).features;
        const processedData = getProcessedData(getDataIds(selections), features);
        const selectedDataDefinitions = getDataDefinitions(selections);
        const title = getTitle(selectedDataDefinitions);
        const formatter = getFormatter(selectedDataDefinitions);
        const colorScheme = getColorScheme(selectedDataDefinitions);

        const svg = select(svgRef.current);        
        // legend
        const legendSequential = legendColor()
            .cells(5)
            .shapeWidth(20)
            .shapeHeight(30)
            .shapePadding(0)
            .titleWidth(200)
            .title(title)
            .labelFormat(formatter)
            .orient("vertical")
            .scale(colorScheme)

        svg.select<SVGGElement>("#legend")
            .attr("transform", "translate(925, 320)")
            // @ts-ignore
            .call(legendSequential)

        // colorized counties
        svg.select("#counties")
            .selectAll("path")
            .data(features)
            .join("path")
            .attr("class", "county")
            .attr("fill", d => {
                const value = processedData.get(d.id as number);
                return colorScheme(value as any) ?? missingDataColor;
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
            .on("touchmove mousemove", handleMouseOverCreator(selectedDataDefinitions, processedData))
            .on("touchend mouseleave", handleMouseOut);
    }, [data, selections]);

    if (data === undefined) {
        return <div id="map"><p className="data-missing">Loading</p></div>;
    }
    if (selections.length === 0) {
        return <div id="map"><p className="data-missing">Please select data</p></div>
    }

    return (
        <div id="map">
        <svg ref={svgRef} viewBox="0, 0, 1175, 610">
            <g id="legend"></g>
            <g id="counties"></g>
            <g id="states"><path /></g>
        </svg>
        <DataDescription
            selections={selections}
            shouldShow={showDataDescription}
            showClicked={onDataDescriptionClicked}
        />
        <DatasetDescription
            datasets={selections.map(getDataset)}
            shouldShow={showDatasetDescription}
            showClicked={onDatasetDescriptionClicked}
        />
        </div>
    );
}

export default MapUI;