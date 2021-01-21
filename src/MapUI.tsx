import React, { useRef, useEffect } from 'react';
import { select, geoPath } from 'd3';
import { Feature, Geometry } from 'geojson';
import { feature, mesh } from 'topojson-client';
import { Objects, Topology, GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import DataDescription from './DataDescription';
import dataDefinitions, { DataDefinition, DataIdParams, Normalization, percentileColorScheme, standardDeviationColorScheme, getUnits, percentileFormatter, standardDeviationFormatter } from './DataDefinitions';
import { legendColor } from 'd3-svg-legend';
import DatasetDescription from './DatasetDescription';
import { Map as ImmutableMap } from 'immutable';
import states, { State } from './States';
import  Counties from './Counties';
import { ProcessedData } from './DataProcessor';
import ProbabilityDensity from './ProbabilityDensity';

export enum Aggregation {
    State = "state",
    County = "county",
};

type Props = {
    map: Topology<Objects<GeoJsonProperties>> | undefined,
    selections: DataIdParams[],
    processedData: ProcessedData | undefined,
    showDatasetDescription: boolean,
    onDatasetDescriptionClicked: () => void,
    showDataDescription: boolean,
    onDataDescriptionClicked: () => void,
    aggregation: Aggregation,
    state: State | undefined,
    onStateChange: (state: State | undefined) => void
};

const MapUI = ({
    map,
    selections,
    processedData,
    showDatasetDescription,
    onDatasetDescriptionClicked,
    showDataDescription,
    onDataDescriptionClicked,
    aggregation,
    state,
    onStateChange,
}: Props) => {
    const svgRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        if (map === undefined) {
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

        if (processedData === undefined) {      
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

        const selectedDataDefinitions = getDataDefinitions(selections);
        const title = getTitle(selectedDataDefinitions, selections);
        const formatter = getFormatter(selectedDataDefinitions, selections);
        const colorScheme = getColorScheme(selectedDataDefinitions, selections);
        const legendCells = getLegendCells(selections);

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
                .attr("d", path).on("click", (_, feature) => onStateChange((feature?.id as string).slice(0,2) as State));
            svg.select("#states").selectAll("path").attr("fill", "none");
            svg.select("#counties")
                .transition()
                .duration(200)
                .attr("transform", "translate(0)scale(1)");
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
            .on("touchmove mousemove", handleCountyMouseOver(selectedDataDefinitions, processedData, selections))
            .on("touchend mouseleave", handleMouseOut);
    }, [map, selections, aggregation, state, onStateChange, processedData]);

    if (map === undefined) {
        return <div id="map"><p className="data-missing">Loading</p></div>;
    }

    const getArrayOfData = () => {
        if (processedData === undefined) {
          return undefined;
        }
        return Array
          .from(processedData.valueSeq())
          .filter(value => value !== undefined) as number[];
    }

    return (
        <div id="map">
        <svg ref={svgRef} viewBox="0, 0, 1175, 610">
            <g id="legend"></g>
            <ProbabilityDensity data={getArrayOfData()} selections={selections} />
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

const handleCountyMouseOver = (
    selectedDataDefinitions: DataDefinition[],
    processedCountyData: ImmutableMap<string, number | undefined>,
    selections: DataIdParams[]) => {
    return function(this: any, event: any, d: any) {
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

        tooltip.html(`${name}: ${format(value, selectedDataDefinitions, selections)}`)	
            .style("left", `${event.pageX + 20}px`)		
            .style("top", (event.pageY - 45) + "px");
    }
};


const format = (value: number | undefined, selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const formatter = getFormatter(selectedDataDefinitions, selections);
    if (value === undefined) {
        return "No data";
    }
    if (selectedDataDefinitions.length === 1) {
        let units = getUnits(selectedDataDefinitions[0], selections[0].normalization);
        return formatter(value) + getUnitString(units);
    } else {
        return formatter(value);
    }
}

const getUnitString = (units: string) => units ? ` ${units}` : "";
const getUnitStringWithParens = (units: string) => units ? ` (${units})` : "";

const handleMouseOut = function(this:any) {
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

const getLegendCells = (selections: DataIdParams[]) => {
    if (selections[0].normalization === Normalization.StandardDeviations) {
        return 9;
    } else {
        return 5;
    }
}

const getTitle = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    if (selectedDataDefinitions.length === 1) {
        const dataDefinition = selectedDataDefinitions[0];
        const units = getUnits(dataDefinition, selections[0].normalization);
        return dataDefinition.name + getUnitStringWithParens(units);
    } else {
        const names = selectedDataDefinitions.map(dataDefinition => dataDefinition.name);
        return "Mean of " + names.join(", ");
    }
}

const getFormatter = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const normalization = selections[0].normalization;
    switch(normalization) {
        case Normalization.Raw: return selectedDataDefinitions[0].formatter;
        case Normalization.Percentile: return percentileFormatter;
        case Normalization.StandardDeviations: return standardDeviationFormatter;
    }
}

const getColorScheme = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const normalization = selections[0].normalization;
    switch(normalization) {
        case Normalization.Raw: return selectedDataDefinitions[0].color;
        case Normalization.Percentile: return percentileColorScheme;
        case Normalization.StandardDeviations: return standardDeviationColorScheme;
    }        
}

const stateFilter = (state: State | undefined) => (feature: Feature<Geometry, GeoJsonProperties>) => {
    if (state === undefined) {
        return true;
    }
    const stateId = (feature.id! as string).slice(0,2);
    return stateId === state;
}

export default MapUI;
