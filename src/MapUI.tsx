import React, { useRef, useEffect } from 'react';
import { select, geoPath, event, mean, DSVRowArray } from 'd3';
import { Feature, Geometry } from 'geojson';
import { feature, mesh } from 'topojson-client';
import { Objects, Topology, GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import DataDescription from './DataDescription';
import dataDefinitions, { DataDefinition, DataIdParams, DataId, DataType, DataGroup } from './DataDefinitions';
import { legendColor } from 'd3-svg-legend';
import DatasetDescription from './DatasetDescription';
import { Map as ImmutableMap } from 'immutable';
import states, { State } from './States';
import  Counties from './Counties';

export enum Aggregation {
    State = "state",
    County = "county",
};

type Props = {
    map: Topology<Objects<GeoJsonProperties>> | undefined,
    data: DSVRowArray<string> | undefined,
    selections: DataIdParams[],
    showDatasetDescription: boolean,
    onDatasetDescriptionClicked: () => void,
    showDataDescription: boolean,
    onDataDescriptionClicked: () => void,
    dataWeights: ImmutableMap<DataGroup, number>,
    aggregation: Aggregation,
    state: State | undefined,
    onStateChange: (state: State | undefined) => void
};

const MapUI = ({
    map,
    data,
    selections,
    showDatasetDescription,
    onDatasetDescriptionClicked,
    showDataDescription,
    onDataDescriptionClicked,
    dataWeights,
    aggregation,
    state,
    onStateChange,
}: Props) => {
    let dataMap: ImmutableMap<string, any> | undefined;
    if (data !== undefined) {
        dataMap = ImmutableMap(data.map(row => [row["STATEFP"]! + row["COUNTYFP"]!, {...row}]));
    } else {
        dataMap = undefined;
    }
    const svgRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        if (map === undefined) {
            return;
        }
        if (dataMap === undefined) {
            return;
        }
        const countyFeatures = feature(
            map,
            map.objects.counties as GeometryCollection<GeoJsonProperties>
        ).features.filter(stateFilter(state));
        const stateFeatures = feature(
            map,
            map.objects.states as GeometryCollection<GeoJsonProperties>
        ).features.filter(stateFilter(state));
        const svg = select(svgRef.current);
        const path = geoPath();
        // state borders
        svg.select("#state-borders")
            .select("path")
            .datum(mesh(map, map.objects.states as GeometryCollection, (a, b) => a !== b))
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("d", path);
        if (selections.length === 0) {      
            svg.select("#legend").selectAll("*").remove();
            svg.select("#states")
                .selectAll("path")
                .data(stateFeatures)
                .join("path")
                .attr("class", "state")
                .attr("fill", noDataSelectedColor)
                .attr("d", path);
            svg.select("#counties").selectAll("path").attr("fill", "none");
            svg
                .selectAll(".state")
                .on("touchmove mousemove", null)
                .on("touchend mouseleave", null);
            return;
        }
        const processedData = getProcessedCountyData(selections, dataMap, dataWeights);
        // const processedStateData = getProcessedStateData(processedData);
        const selectedDataDefinitions = getDataDefinitions(selections);
        const title = getTitle(selectedDataDefinitions);
        const formatter = getFormatter(selectedDataDefinitions);
        const colorScheme = getColorScheme(selectedDataDefinitions);
        const legendCells = getLegendCells(selectedDataDefinitions);

        // legend
        const legendSequential = legendColor()
            .cells(legendCells)
            .shapeWidth(20)
            .shapeHeight(30)
            .shapePadding(0)
            .titleWidth(200)
            .title(title)
            .labelFormat(formatter)
            .orient("vertical")
            .scale(colorScheme)

        svg.select<SVGGElement>("#legend")
            .attr("transform", "translate(925, 220)")
            // @ts-ignore
            .call(legendSequential)

        if (aggregation === Aggregation.County) {
            // colorized counties
            svg.select("#counties")
                .selectAll("path")
                .data(countyFeatures)
                .join("path")
                .attr("class", "county")
                .attr("fill", d => {
                    const value = processedData.get(d.id as string);
                    return colorScheme(value as any) ?? missingDataColor;
                })
                .attr("d", path).on("click", feature => onStateChange((feature?.id as string).slice(0,2) as State));
            svg.select("#states").selectAll("path").attr("fill", "none");
            svg.select("#counties")
                .transition()
                .duration(200)
                .attr("transform", "translate(0)scale(1)");
        } else if (aggregation === Aggregation.State) {
            // colorized states
            // svg.select("#states")
            //     .selectAll("path")
            //     .data(stateFeatures)
            //     .join("path")
            //     .attr("class", "state")
            //     .attr("fill", d => {
            //         const value = processedStateData.get(d.id as string);
            //         return colorScheme(value as any) ?? missingDataColor;
            //     })
            //     .attr("d", path);
            // svg.select("#counties").selectAll("path").attr("fill", "none");
        }

        if (state !== undefined) {
            const width = 900;
            var bounds = path.bounds(stateFeatures[0]),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = .9 / Math.max(dx / width, dy / 610),
                translate = [width / 2 - scale * x, 610 / 2 - scale * y];

            svg.select("#counties")
                .selectAll("path")
                .on("click", () => onStateChange(undefined));
            svg.select("#state-borders")
                .selectAll("path")
                .attr("stroke", "none");
            svg.select("#counties")
                .transition()
                .duration(200)
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
        }

        // tooltips
        svg
            .selectAll(".county")
            .on("touchmove mousemove", handleCountyMouseOver(selectedDataDefinitions, processedData))
            .on("touchend mouseleave", handleMouseOut);

        // svg
        //     .selectAll(".state")
        //     .on("touchmove mousemove", handleStateMouseOver(selectedDataDefinitions, processedStateData))
        //     .on("touchend mouseleave", handleMouseOut);
    }, [map, selections, dataWeights, aggregation, state, onStateChange, dataMap]);

    if (map === undefined) {
        return <div id="map"><p className="data-missing">Loading</p></div>;
    }

    return (
        <div id="map">
        <svg ref={svgRef} viewBox="0, 0, 1175, 610">
            <g id="legend"></g>
            <g id="counties"></g>
            <g id="states"></g>
            <g id="state-borders"><path /></g>
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

const missingDataColor = "#ccc";
const noDataSelectedColor = "#eee";

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

const handleCountyMouseOver = (selectedDataDefinitions: DataDefinition[], processedCountyData: ImmutableMap<string, number | undefined>) => {
    return function(this: any, d: any) {
        select(this)
            .style("opacity", 0.5)
            .style("stroke", "black")
            .style("stroke-width", 0.5)
    
        tooltip.transition()
            .duration(200)
            .style("opacity", .9)
        
        let county = Counties.get(d.id);
        let state = states.get(d.id.slice(0,2) as State);
        let name = "---";
        if (state && county) {
            name = county + ", " + state;
        }
        let value = processedCountyData.get(d.id);

        tooltip.html(`${name}: ${format(value, selectedDataDefinitions)}`)	
            .style("left", `${event.pageX + 20}px`)		
            .style("top", (event.pageY - 45) + "px");
    }
};

const handleStateMouseOver = (selectedDataDefinitions: DataDefinition[], processedStateData: ImmutableMap<string, number | undefined>) => {
    return function(this: any, d: any) {
        select(this).style("opacity", 0.5)
    
        tooltip.transition()
            .duration(200)
            .style("opacity", .9)
        
        let value = processedStateData.get(d.id);

        tooltip.html(`${format(value, selectedDataDefinitions)}`)	
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

const getDataset = (selection: DataIdParams) => {
    // get the selected dataset, or the first one, if there's none selected
    return selection.dataset ?? dataDefinitions.get(selection.dataGroup)!.datasets[0];
}   

const getDataDefinitions = (selections: DataIdParams[]) => {
    return selections.map(selection => dataDefinitions.get(selection.dataGroup)!);
}

const getLegendCells = (selectedDataDefinitions: DataDefinition[]) => {
    if (selectedDataDefinitions[0].type === DataType.Normalized) {
        return 9;
    } else {
        return 5;
    }
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

const getProcessedStateData = (processedCountyData: ImmutableMap<string, number | undefined>) => {
    const stateData = new Map<string, number[]>();
    for (const countyId of processedCountyData.keys()) {
        const countyData = processedCountyData.get(countyId);
        const stateId = countyId.slice(0, 2)
        if (stateData.has(stateId)) {
            stateData.get(stateId)!.push(countyData ?? 0);
        } else {
            stateData.set(stateId, [countyData ?? 0]);
        }
    }
    return ImmutableMap(Array.from(stateData.entries(), ([stateId, dataList]) => [stateId, mean(dataList)]));
}

const getProcessedCountyData = (selections: DataIdParams[], data: ImmutableMap<string, any>, dataWeights: ImmutableMap<DataGroup, number>) => {
    let valuesById: [string, number | undefined][] = [];
    for (const [key, datum] of data.entries()) {
        let value = undefined;
        const values: number[] = [];
        for (const selection of selections) {
            const dataId = dataDefinitions.get(selection.dataGroup)!.id(selection);
            if (datum[DataId[dataId]]) {
                values.push(+datum[DataId[dataId]] * (dataWeights.get(selection.dataGroup) ?? 1));
            }
        }
        value = mean(values);

        valuesById.push([key as string, value]);
    }
    return ImmutableMap<string, number | undefined>(valuesById);
}

const stateFilter = (state: State | undefined) => (feature: Feature<Geometry, GeoJsonProperties>) => {
    if (state === undefined) {
        return true;
    }
    const stateId = (feature.id! as string).slice(0,2);
    return stateId === state;
}

export default MapUI;