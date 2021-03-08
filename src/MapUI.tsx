import React, { useRef, useEffect } from 'react';
import { select, geoPath, scaleSqrt, max, Selection, GeoPath, GeoPermissibleObjects, ScalePower } from 'd3';
import { Feature, Geometry } from 'geojson';
import { feature, mesh } from 'topojson-client';
import { GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import DataDescription from './DataDescription';
import dataDefinitions, { DataDefinition, DataIdParams, Normalization, percentileColorScheme, getUnits, percentileFormatter, DataGroup, MapType, DataType } from './DataDefinitions';
import DatasetDescription from './DatasetDescription';
import { Map as ImmutableMap } from 'immutable';
import states, { State } from './States';
import Counties from './Counties';
import DataProcessor from './DataProcessor';
import ProbabilityDensity from './ProbabilityDensity';
import { ColorScheme, Data, TopoJson } from './Home';
import Legend from './Legend';
import BubbleLegend from './BubbleLegend';
import Checkbox from '@material-ui/core/Checkbox';
import { FormControlLabel } from '@material-ui/core';

export enum Aggregation {
    State = "state",
    County = "county",
};

type SVGSelection = Selection<SVGSVGElement | null, unknown, null, undefined>;

type Props = {
    roadMap: TopoJson | undefined,
    showRoads: boolean,
    map: TopoJson | undefined,
    selections: DataIdParams[],
    data: Data,
    dataWeights: ImmutableMap<DataGroup, number>,
    showDatasetDescription: boolean,
    onDatasetDescriptionClicked: () => void,
    showDataDescription: boolean,
    onDataDescriptionClicked: () => void,
    aggregation: Aggregation,
    state: State | undefined,
    onStateChange: (state: State | undefined) => void,
    onShowRoadsChange: (showRoads: boolean) => void,
};

const MapUI = ({
    roadMap,
    showRoads,
    map,
    selections,
    data,
    dataWeights,
    showDatasetDescription,
    onDatasetDescriptionClicked,
    showDataDescription,
    onDataDescriptionClicked,
    aggregation,
    state,
    onStateChange,
    onShowRoadsChange,
}: Props) => {
    const processedData = DataProcessor(data, selections, dataWeights, state);

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

        if (showRoads && roadMap !== undefined && state === undefined) {
            const roadFeatures = feature(
                roadMap,
                roadMap.objects.roads as GeometryCollection<GeoJsonProperties>
            ).features;
            drawRoads(svg, roadFeatures, path);
        } else {
            clearRoads(svg);
        }

        if (processedData === undefined) {
            clearMap(svg, stateFeatures, path);
            return;
        }

        const selectedDataDefinitions = getDataDefinitions(selections);
        const colorScheme = getColorScheme(selectedDataDefinitions, selections);
        const mapType = selectedDataDefinitions[0].mapType;

        // data
        if (aggregation === Aggregation.County) {
            if (mapType === MapType.Choropleth) {
                drawChoropleth(svg, countyFeatures, processedData, colorScheme, path, onStateChange);
            } else if (mapType === MapType.Bubble) {
                drawBubbles(countyFeatures, processedData, svg, stateFeatures, path, radius);
            }
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
    }, [map, selections, aggregation, state, onStateChange, processedData, showRoads, roadMap]);

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

    const selectedDataDefinitions = getDataDefinitions(selections);
    const color = getColorScheme(selectedDataDefinitions, selections);
    const legendFormatter = getLegendFormatter(selectedDataDefinitions, selections);
    const ticks = getLegendTicks(selectedDataDefinitions, selections);
    const title = getTitle(selectedDataDefinitions, selections);

    const countyFeatures = feature(
        map,
        map.objects.counties as GeometryCollection<GeoJsonProperties>
    ).features.filter(stateFilter(state));
    let radius: ScalePower<number, number, never>;
    if (processedData !== undefined) {
        const values = countyFeatures.map(d => processedData.get(d.id as string)).filter(d => d !== undefined).map(d => d as number);
        radius = scaleSqrt([0, max(values) ?? 0], [0, 40]);
    } else {
        radius = scaleSqrt([0, 0], [0, 40]);
    }


    return (
        <div id="map">
            {state === undefined &&
                <FormControlLabel
                    id="show-roads"
                    control={
                        <Checkbox
                            onChange={(_, value) => onShowRoadsChange(value)}
                            title="Show roads"
                            color="primary" />
                    }
                    label="Show roads"
                />
            }

            <svg ref={svgRef} viewBox="0, 0, 1175, 610">
                <g id="counties"></g>
                <g id="states"></g>
                <g id="state-borders"><path /></g>
                <g id="road-map"></g>
                <g id="circles"></g>
                {shouldShowBubbleLegend(selections) && <BubbleLegend title={title} radius={radius} />}
                {shouldShowLegend(selections) && <Legend title={title} color={color} tickFormat={legendFormatter} ticks={ticks} />}
                {
                    shouldShowPdf(selections) &&
                    <ProbabilityDensity
                        data={getArrayOfData()}
                        selections={selections}
                        xRange={getPdfDomain(selections)}
                        formatter={getLegendFormatter(selectedDataDefinitions, selections)}
                    />
                }
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
    .style("padding", "4px")
    .style("background", "white")
    .style("pointer-events", "none");

const handleCountyMouseOver = (
    selectedDataDefinitions: DataDefinition[],
    processedCountyData: ImmutableMap<string, number | undefined>,
    selections: DataIdParams[]) => {
    return function (this: any, event: any, d: any) {
        select(this)
            .style("opacity", 0.5)
            .style("stroke", "black")
            .style("stroke-width", 0.5)

        tooltip.transition()
            .duration(200)
            .style("opacity", .95)

        let county = Counties.get(d.id);
        let state = states.get(d.id.slice(0, 2) as State);
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
    let units = getUnits(selectedDataDefinitions[0], selections[0].normalization);
    if (units === "Percentile") {
        return formatter(value);
    } else {
        return formatter(value) + getUnitString(units);
    }
}

const getUnitString = (units: string) => units ? ` ${units}` : "";

const handleMouseOut = function (this: any) {
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

const getTitle = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const dataDefinition = selectedDataDefinitions[0];
    const units = getUnits(dataDefinition, selections[0].normalization);
    const unitString = getUnitString(units);
    if (selectedDataDefinitions.length === 1) {
        return unitString;
    } else {
        return "Mean of selected data";
    }
}

const getFormatter = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const normalization = selections[0].normalization;
    switch (normalization) {
        case Normalization.Raw: return selectedDataDefinitions[0].formatter;
        case Normalization.Percentile: return percentileFormatter;
    }
}

const getLegendFormatter = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const normalization = selections[0].normalization;
    switch (normalization) {
        case Normalization.Raw: return selectedDataDefinitions[0].legendFormatter;
        case Normalization.Percentile: return percentileFormatter;
    }
}

const getLegendTicks = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const normalization = selections[0].normalization;
    switch (normalization) {
        case Normalization.Raw: return selectedDataDefinitions[0].legendTicks;
        case Normalization.Percentile: return undefined;
    }
}

const getColorScheme = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const normalization = selections[0].normalization;
    switch (normalization) {
        case Normalization.Raw: return selectedDataDefinitions[0].color;
        case Normalization.Percentile: return percentileColorScheme;
    }
}

const stateFilter = (state: State | undefined) => (feature: Feature<Geometry, GeoJsonProperties>) => {
    if (state === undefined) {
        return true;
    }
    const stateId = (feature.id! as string).slice(0, 2);
    return stateId === state;
}

function clearMap(svg: SVGSelection, stateFeatures: Feature<Geometry, GeoJsonProperties>[], path: GeoPath<any, GeoPermissibleObjects>) {
    svg.select("#legend").selectAll("*").remove();
    svg.select("#bubble-legend").selectAll("*").remove();
    svg.select("#states")
        .selectAll("path")
        .data(stateFeatures)
        .join("path")
        .attr("class", "state")
        .attr("fill", noDataSelectedColor)
        .attr("d", path);
    svg.select("#counties").selectAll("path").attr("fill", "none");
    svg.select("#circles").selectAll("circle").attr("r", 0);
    svg
        .selectAll(".state")
        .on("touchmove mousemove", null)
        .on("touchend mouseleave", null);
}

function clearRoads(svg: SVGSelection) {
    svg.select("#road-map").selectAll("*").remove();
}

function drawRoads(svg: SVGSelection,
                   roadFeatures: Feature<Geometry, GeoJsonProperties>[],
                   path: GeoPath<any, GeoPermissibleObjects>) {
    svg.select("#road-map")
        .selectAll("path")
        .data(roadFeatures)
        .join("path")
        .attr("stroke", "grey")
        .attr("fill", "none")
        .attr("stroke-width", d => 1/d.properties!.scalerank * 5)
        .attr("d", path);
}

function drawChoropleth(svg: SVGSelection,
    countyFeatures: Feature<Geometry, GeoJsonProperties>[],
    processedData: ImmutableMap<string, number | undefined>,
    colorScheme: ColorScheme,
    path: GeoPath<any, GeoPermissibleObjects>,
    onStateChange: (state: State | undefined) => void) {
    svg.select("#circles").selectAll("circle").attr("r", 0);
    svg.select("#counties")
        .selectAll("path")
        .data(countyFeatures)
        .join("path")
        .attr("class", "county")
        .attr("fill", d => {
            const value = processedData.get(d.id as string);
            return colorScheme(value as any) ?? missingDataColor;
        })
        .attr("d", path).on("click", (_, feature) => onStateChange((feature?.id as string).slice(0, 2) as State));
    svg.select("#states").selectAll("path").attr("fill", "none");
    svg.select("#counties")
        .transition()
        .duration(200)
        .attr("transform", "translate(0)scale(1)");
}

function drawBubbles(countyFeatures: Feature<Geometry, GeoJsonProperties>[],
    processedData: ImmutableMap<string, number | undefined>,
    svg: SVGSelection,
    stateFeatures: Feature<Geometry, GeoJsonProperties>[],
    path: GeoPath<any, GeoPermissibleObjects>,
    radius: ScalePower<number, number, never>) {
    svg.select("#counties").selectAll("path").attr("fill", "none");
    svg.select("#states")
        .selectAll("path")
        .data(stateFeatures)
        .join("path")
        .attr("class", "state")
        .attr("fill", noDataSelectedColor)
        .attr("d", path);
    svg.select("#circles")
        .selectAll("circle")
        .data(countyFeatures)
        .join("circle")
        .attr("fill", "rgb(34, 139, 69)")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .attr("transform", d => `translate(${path.centroid(d)})`)
        .attr("r", d => {
            const value = processedData.get(d.id as string);
            return radius(value ?? 0);
        });
}

function shouldShowPdf(selections: DataIdParams[]) {
    const firstSelection = getDataDefinitions(selections)[0];
    if (selections[0] !== undefined && selections[0].dataGroup === DataGroup.Populationpersquaremile2010) {
        return false;
    }
    return firstSelection !== undefined && firstSelection.mapType === MapType.Choropleth;
}

function shouldShowBubbleLegend(selections: DataIdParams[]) {
    const firstSelection = getDataDefinitions(selections)[0];
    return firstSelection !== undefined && firstSelection.mapType === MapType.Bubble;
}

function shouldShowLegend(selections: DataIdParams[]) {
    const firstSelection = getDataDefinitions(selections)[0];
    return firstSelection !== undefined && firstSelection.mapType === MapType.Choropleth;
}

function getPdfDomain(selections: DataIdParams[]) {
    const firstSelection = getDataDefinitions(selections)[0];
    if (firstSelection === undefined) {
        return undefined;
    }

    if (firstSelection.type === DataType.ClimateOpinions) {
        return [0, 100] as [number, number];
    }

    if (selections[0].normalization === Normalization.Percentile) {
        return [0, 1] as [number, number];
    }
}

export default MapUI;
