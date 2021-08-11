import React, { useRef, useEffect, useState } from 'react';
import { select, geoPath, scaleSqrt, max, Selection, GeoPath, GeoPermissibleObjects, ScalePower, csvFormat } from 'd3';
import { Feature, Geometry } from 'geojson';
import { feature, mesh } from 'topojson-client';
import { GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import DataDescription from './DataDescription';
import dataDefinitions, { DataDefinition, DataIdParams, Normalization, DataGroup, MapType, DataType, getUnits, riskMetricFormatter } from './DataDefinitions';
import DatasetDescription from './DatasetDescription';
import { Map as ImmutableMap } from 'immutable';
import states, { State } from './States';
import Counties from './Counties';
import DataProcessor from './DataProcessor';
import ProbabilityDensity from './ProbabilityDensity';
import { ColorScheme, useThunkDispatch } from './Home';
import Legend from './Legend';
import BubbleLegend from './BubbleLegend';
import { Button, FormControlLabel, MenuItem, Select, Switch, Checkbox, InputLabel, FormControl } from '@material-ui/core';
import Color from './Color';
import counties from './Counties';
import { saveAs } from 'file-saver';
import waterway_types, { WaterwayValue } from './WaterwayType';
import { useSelector } from 'react-redux';
import { RootState, store } from './store';
import { setDetailedView, setShowRailroads, setShowRoads, setShowToxicSites, setShowTransmissionLines, setShowWaterways, setState } from './appSlice';

export enum Aggregation {
    State = "state",
    County = "county",
};

type SVGSelection = Selection<SVGSVGElement | null, unknown, null, undefined>;

const MapUI = () => {
    const dispatch = useThunkDispatch();
    const {
        selections,
        roadMap,
        showRoads,
        railroadMap,
        showRailroads,
        waterwayMap,
        transmissionLinesMap,
        transmissionLinesLevel2Map,
        toxicSitesMap,
        showWaterways,
        showTransmissionLines,
        showToxicSites,
        map,
        data,
        dataWeights,
        state,
        detailedView,
    } = useSelector((state: RootState) => ({
        ...state.app,
        selections: state.app.dataSelections[state.app.dataTab] ?? [],
    }));
    const processedData = DataProcessor(data, selections, dataWeights, state);
    const [waterwayValue, setWaterwayValue] = useState<WaterwayValue>("total");
    type TransmissionLinesType = "Level 2 (230kV-345kV)" | "Level 3 (>= 345kV)";
    const transmissionLinesTypes: TransmissionLinesType[] = ["Level 2 (230kV-345kV)", "Level 3 (>= 345kV)"];
    const [transmissionLinesType, setTransmissionLinesType] = useState<TransmissionLinesType>("Level 3 (>= 345kV)");

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

        if (showRoads && roadMap !== undefined) {
            const roadFeatures = feature(
                roadMap,
                roadMap.objects.roads as GeometryCollection<GeoJsonProperties>
            ).features;
            drawRoadsAndFerries(svg, roadFeatures, path);
        } else {
            clearRoads(svg);
        }

        if (showRailroads && railroadMap !== undefined) {
            const railroadFeatures = feature(
                railroadMap,
                railroadMap.objects.railroads as GeometryCollection<GeoJsonProperties>
            ).features;
            drawRailroads(svg, railroadFeatures, path);
        } else {
            clearRailroads(svg);
        }
        function drawWaterways(svg: SVGSelection,
            roadFeatures: Feature<Geometry, GeoJsonProperties>[],
            path: GeoPath<any, GeoPermissibleObjects>) {
            svg.select("#waterway-map")
                .selectAll("path")
                .data(roadFeatures)
                .join("path")
                .attr("stroke", "#0099ff")
                .attr("fill", "none")
                .attr("stroke-width", d => Math.sqrt(d.properties![waterwayValue] / 5_000_000))
                .attr("d", path);
        }
        if (showWaterways && waterwayMap !== undefined) {
            const waterwayFeatures = feature(
                waterwayMap,
                waterwayMap.objects.waterways as GeometryCollection<GeoJsonProperties>
            ).features;
            drawWaterways(svg, waterwayFeatures, path);
        } else {
            clearWaterways(svg);
        }

        if (showTransmissionLines && transmissionLinesMap !== undefined && transmissionLinesLevel2Map !== undefined) {
            const transmissionMap = transmissionLinesType === "Level 2 (230kV-345kV)" ?
                transmissionLinesLevel2Map :
                transmissionLinesMap;
            const transmissionLinesFeatures = feature(
                transmissionMap,
                transmissionMap.objects.electric_lines as GeometryCollection<GeoJsonProperties>
            ).features;
            const color = transmissionLinesType === "Level 2 (230kV-345kV)" ?
                "yellowgreen" :
                "orangered";
            drawTransmissionLines(svg, transmissionLinesFeatures, path, color);
        } else {
            clearTransmissionLines(svg);
        }

        if (showToxicSites && toxicSitesMap !== undefined) {
            const features = feature(
                toxicSitesMap,
                toxicSitesMap.objects["toxic-sites"] as GeometryCollection<GeoJsonProperties>
            ).features;
            drawToxicSites(svg, features);
        } else {
            clearToxicSites(svg);
        }

        if (processedData === undefined) {
            clearMap(svg, stateFeatures, path);
            return;
        }

        const selectedDataDefinitions = getDataDefinitions(selections);
        const colorScheme = Color(selections, detailedView);
        const mapType = selectedDataDefinitions[0].mapType;
        const radius = getRadius(countyFeatures, processedData);

        // data
        if (mapType === MapType.Choropleth) {
            drawChoropleth(svg, countyFeatures, processedData, colorScheme, path, dispatch);
        } else if (mapType === MapType.Bubble) {
            drawBubbles(countyFeatures, processedData, svg, stateFeatures, path, radius);
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
                .on("click", () => dispatch(setState(undefined)));
            svg.select("#state-borders")
                .selectAll("path")
                .attr("stroke", "none");
            svg.select("#counties")
                .transition()
                .duration(200)
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
            svg.select("#road-map")
                .transition()
                .duration(200)
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
            svg.select("#railroad-map")
                .transition()
                .duration(200)
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
            svg.select("#waterway-map")
                .transition()
                .duration(200)
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
            svg.select("#transmission-lines-map")
                .transition()
                .duration(200)
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
            svg.select("#toxic-sites-map")
                .transition()
                .duration(200)
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
        }

        // tooltips
        svg
            .selectAll(".county")
            .on("touchmove mousemove", handleCountyMouseOver(selectedDataDefinitions, processedData, selections))
            .on("touchend mouseleave", handleMouseOut);
    }, [map,
        selections,
        state,
        processedData,
        showRoads,
        roadMap,
        railroadMap,
        toxicSitesMap,
        showToxicSites,
        showRailroads,
        waterwayMap,
        showWaterways,
        detailedView,
        waterwayValue,
        showTransmissionLines,
        transmissionLinesMap,
        transmissionLinesLevel2Map,
        transmissionLinesType,
        dispatch,
    ]);

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

    const downloadData = () => {
        const objectData = processedData
            ?.sortBy((_, fipsCode) => fipsCode)
            .map((value, fipsCode) => {
                const county = counties.get(fipsCode);
                const state = states.get(fipsCode.slice(0, 2) as State);
                return { fipsCode, state, county, value };
            })
            .valueSeq()
            .toArray();
        if (objectData) {
            const csv = csvFormat(objectData, ["fipsCode", "state", "county", "value"]);
            const blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
            saveAs(blob, getFilename(getDataDefinitions(selections), selections) + ".csv");
        }
    }

    const legends = (processedData: ImmutableMap<string, number | undefined> | undefined) => {
        if (processedData === undefined) {
            return null;
        }

        const selectedDataDefinitions = getDataDefinitions(selections);
        const color = Color(selections, detailedView);
        const legendFormatter = getLegendFormatter(selectedDataDefinitions, selections);
        const ticks = getLegendTicks(selectedDataDefinitions, selections);
        const title = getLegendTitle(selectedDataDefinitions, selections);

        const countyFeatures = feature(
            map,
            map.objects.counties as GeometryCollection<GeoJsonProperties>
        ).features.filter(stateFilter(state));
        const radius = getRadius(countyFeatures, processedData);

        return (
            <React.Fragment>
                {shouldShowBubbleLegend(selections) && <BubbleLegend title={title} radius={radius} />}
                {
                    shouldShowLegend(selections) &&
                    <Legend
                        title={title}
                        color={color}
                        tickFormat={legendFormatter}
                        ticks={ticks}
                        showTooltip={isNormalized(selections)} />
                }
                {
                    shouldShowPdf(selections) &&
                    <ProbabilityDensity
                        data={getArrayOfData()}
                        selections={selections}
                        xRange={getPdfDomain(selections)}
                        formatter={legendFormatter}
                        continuous={detailedView}
                    />
                }
            </React.Fragment>
        );
    }


    return (
        <div id="map">
            <h3 id="map-title">{getTitle(getDataDefinitions(selections), selections)}</h3>
            <svg ref={svgRef} viewBox="0, 0, 1175, 610">
                <g id="counties"></g>
                <g id="states"></g>
                <g id="state-borders"><path /></g>
                <g id="road-map"></g>
                <g id="railroad-map"></g>
                <g id="waterway-map"></g>
                <g id="transmission-lines-map"></g>
                <g id="toxic-sites-map"></g>
                <g id="circles"></g>
                {legends(processedData)}
            </svg>
            {map &&
                <div id="map-controls">
                    <React.Fragment>
                        <FormControlLabel
                            id="show-roads"
                            control={
                                <Checkbox
                                    onChange={(_, value) => dispatch(setShowRoads(value))}
                                    title="Highways"
                                    color="primary" />
                            }
                            label="Highways"
                        />
                        <FormControlLabel
                            id="show-railroads"
                            control={
                                <Checkbox
                                    onChange={(_, value) => dispatch(setShowRailroads(value))}
                                    title="Major railroads"
                                    color="primary" />
                            }
                            label="Major railroads"
                        />
                        <FormControlLabel
                            id="show-transmission-lines"
                            control={
                                <Checkbox
                                    onChange={(_, value) => dispatch(setShowTransmissionLines(value))}
                                    title="Transmission Lines"
                                    color="primary" />
                            }
                            label="Transmission lines"
                        />
                        {showTransmissionLines &&
                            <FormControl>
                                <InputLabel shrink id="transmission-lines-type">
                                    Type
                                </InputLabel>
                                <Select
                                    labelId="transmission-lines-type"
                                    value={transmissionLinesType}
                                    onChange={event => setTransmissionLinesType(event.target.value as TransmissionLinesType)}
                                >
                                    {transmissionLinesTypes.map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)}
                                </Select>
                            </FormControl>
                        }
                        <FormControlLabel
                            id="show-waterways"
                            control={
                                <Checkbox
                                    onChange={(_, value) => dispatch(setShowWaterways(value))}
                                    title="Marine highways"
                                    color="primary" />
                            }
                            label="Marine highways"
                        />
                        {showWaterways &&
                            <FormControl>
                                <InputLabel shrink id="waterway-type">
                                    Tonnage
                                </InputLabel>
                                <Select
                                    labelId="waterway-type"
                                    value={waterwayValue}
                                    onChange={event => setWaterwayValue(event.target.value as WaterwayValue)}
                                >
                                    {waterway_types.map(({ name, value }) => <MenuItem key={value} value={value}>{name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        }
                        <FormControlLabel
                            id="show-toxic-sites"
                            control={
                                <Checkbox
                                    onChange={(_, value) => dispatch(setShowToxicSites(value))}
                                    title="Toxic release sites"
                                    color="primary" />
                            }
                            label="Toxic release sites"
                        />
                    </React.Fragment>
                    {selections[0]?.normalization === Normalization.Percentile && processedData &&
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={detailedView}
                                    onChange={(_, value) => dispatch(setDetailedView(value))}
                                    name="detailed-view"
                                    color="primary"
                                />
                            }
                            label="Detailed View"
                        />
                    }
                    {processedData && <Button variant="outlined" onClick={downloadData}>Download data</Button>}
                </div>
            }
            <DataDescription />
            <DatasetDescription />
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
    if (selections[0].normalization !== Normalization.Raw) {
        return formatter(value);
    } else {
        let units = getUnits(selectedDataDefinitions[0], selections[0].normalization);
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

const getDataDefinitions = (selections: DataIdParams[]) => {
    return selections.map(selection => dataDefinitions.get(selection.dataGroup)!);
}

const getLegendTitle = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const dataDefinition = selectedDataDefinitions[0];
    const units = getUnits(dataDefinition, selections[0].normalization);
    const unitString = getUnitString(units);
    if (selectedDataDefinitions.length === 1) {
        return unitString;
    } else {
        return "Mean of selected data";
    }
}

const getTitle = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    if (selectedDataDefinitions.length > 1) {
        return "Combined data";
    } else if (selectedDataDefinitions.length === 0) {
        return ""
    } else {
        return selectedDataDefinitions[0].name(selections[0].normalization);
    }
}

const getFilename = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const unitString = getLegendTitle(selectedDataDefinitions, selections);
    if (unitString === "Mean of selected data") {
        return unitString;
    } else {
        return selectedDataDefinitions[0].name(selections[0].normalization) + unitString;
    }
}

const getFormatter = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const normalization = selections[0].normalization;
    switch (normalization) {
        case Normalization.Raw: return selectedDataDefinitions[0].formatter;
        case Normalization.Percentile: return riskMetricFormatter;
    }
}

const getLegendFormatter = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const normalization = selections[0].normalization;
    switch (normalization) {
        case Normalization.Raw: return selectedDataDefinitions[0].legendFormatter;
        case Normalization.Percentile: return riskMetricFormatter;
    }
}

const getLegendTicks = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
    const normalization = selections[0].normalization;
    switch (normalization) {
        case Normalization.Raw: return selectedDataDefinitions[0].legendTicks;
        case Normalization.Percentile: return undefined;
    }
}

const stateFilter = (state: State | undefined) => (feature: Feature<Geometry, GeoJsonProperties>) => {
    if (state === undefined) {
        return true;
    }
    const stateId = (feature.id! as string).slice(0, 2);
    return stateId === state;
}

function getRadius(
    countyFeatures: Feature<Geometry, GeoJsonProperties>[],
    processedData: ImmutableMap<string, number | undefined>,
) {
    let radius: ScalePower<number, number, never>;
    if (processedData !== undefined) {
        const values = countyFeatures.map(d => processedData.get(d.id as string)).filter(d => d !== undefined).map(d => d as number);
        radius = scaleSqrt([0, max(values) ?? 0], [0, 40]);
    } else {
        radius = scaleSqrt([0, 0], [0, 40]);
    }
    return radius;
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

function drawRoadsAndFerries(svg: SVGSelection,
    roadFeatures: Feature<Geometry, GeoJsonProperties>[],
    path: GeoPath<any, GeoPermissibleObjects>) {
    svg.select("#road-map")
        .selectAll("path")
        .data(roadFeatures)
        .join("path")
        .attr("stroke", "grey")
        .attr("fill", "none")
        .attr("stroke-width", d => 1 / d.properties!.scalerank * 5)
        .attr("d", path);
}

function drawTransmissionLines(svg: SVGSelection,
    transmissionLinesFeatures: Feature<Geometry, GeoJsonProperties>[],
    path: GeoPath<any, GeoPermissibleObjects>,
    color: string) {
    svg.select("#transmission-lines-map")
        .selectAll("path")
        .data(transmissionLinesFeatures)
        .join("path")
        .attr("stroke", color)
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("d", path);
}

function clearTransmissionLines(svg: SVGSelection) {
    svg.select("#transmission-lines-map").selectAll("*").remove();
}

function drawToxicSites(svg: SVGSelection, features: Feature<Geometry, GeoJsonProperties>[]) {
    const path = geoPath().pointRadius(2);
    svg.select("#toxic-sites-map")
        .selectAll("path")
        .data(features)
        .join("path")
        .attr("fill", "black")
        .attr("d", path);
}
function clearToxicSites(svg: SVGSelection) {
    svg.select("#toxic-sites-map").selectAll("*").remove();
}

function clearRailroads(svg: SVGSelection) {
    svg.select("#railroad-map").selectAll("*").remove();
}

function drawRailroads(svg: SVGSelection,
    roadFeatures: Feature<Geometry, GeoJsonProperties>[],
    path: GeoPath<any, GeoPermissibleObjects>) {
    svg.select("#railroad-map")
        .selectAll("path")
        .data(roadFeatures)
        .join("path")
        .attr("stroke", "grey")
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("d", path);
}

function clearWaterways(svg: SVGSelection) {
    svg.select("#waterway-map").selectAll("*").remove();
}

function drawChoropleth(svg: SVGSelection,
    countyFeatures: Feature<Geometry, GeoJsonProperties>[],
    processedData: ImmutableMap<string, number | undefined>,
    colorScheme: ColorScheme,
    path: GeoPath<any, GeoPermissibleObjects>,
    dispatch: typeof store.dispatch) {
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
        .attr("d", path).on("click", (_, feature) => dispatch(setState((feature?.id as string).slice(0, 2) as State)));
    svg.select("#states").selectAll("path").attr("fill", "none");
    svg.select("#counties")
        .transition()
        .duration(200)
        .attr("transform", "translate(0)scale(1)");
    svg.select("#road-map")
        .transition()
        .duration(200)
        .attr("transform", "translate(0)scale(1)");
    svg.select("#railroad-map")
        .transition()
        .duration(200)
        .attr("transform", "translate(0)scale(1)");
    svg.select("#waterway-map")
        .transition()
        .duration(200)
        .attr("transform", "translate(0)scale(1)");
    svg.select("#transmission-lines-map")
        .transition()
        .duration(200)
        .attr("transform", "translate(0)scale(1)");
    svg.select("#toxic-sites-map")
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

function isNormalized(selections: DataIdParams[]) {
    return selections[0]?.normalization === Normalization.Percentile;
}

function shouldShowPdf(selections: DataIdParams[]) {
    const firstSelection = getDataDefinitions(selections)[0];
    if (selections[0] !== undefined && selections[0].dataGroup === DataGroup.Populationpersquaremile2010) {
        return false;
    }
    if (selections[0]?.normalization === Normalization.Percentile) {
        return selections.length > 1;
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

    return undefined;
}

export default MapUI;
