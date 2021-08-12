import React, { useRef, useEffect } from 'react';
import { select, geoPath, scaleSqrt, max, Selection, GeoPath, GeoPermissibleObjects, ScalePower } from 'd3';
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
import { Tooltip, IconButton, makeStyles } from '@material-ui/core';
import Color from './Color';
import { useSelector } from 'react-redux';
import { RootState, store } from './store';
import { Overlay, OverlayName, setState, TransmissionLineType } from './appSlice';
import { Info } from '@material-ui/icons';
import MapControls from './MapControls';
import { WaterwayValue } from './WaterwayType';

export enum Aggregation {
    State = "state",
    County = "county",
};

type SVGSelection = Selection<SVGSVGElement | null, unknown, null, undefined>;
const useTooltipStyles = makeStyles(theme => ({
    arrow: {
        color: theme.palette.common.black,
    },
    tooltip: {
        backgroundColor: theme.palette.common.black,
        fontSize: theme.typography.fontSize,
    },
}));

const MapUI = () => {
    const dispatch = useThunkDispatch();
    const {
        selections,
        map,
        overlays,
        data,
        dataWeights,
        state,
        waterwayValue,
        transmissionLineType,
        detailedView,
    } = useSelector((state: RootState) => ({
        ...state.app,
        selections: state.app.dataSelections[state.app.dataTab] ?? [],
    }));
    const tooltipClasses = useTooltipStyles();
    const processedData = DataProcessor(data, selections, dataWeights, state);

    const svgRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        if (!map) {
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

        for (const [overlayName, overlay] of Object.entries(overlays) as [OverlayName, Overlay][]) {
            if (overlay.shouldShow && overlay.topoJson) {
                const topoJson = overlay.topoJson;
                const features = feature(topoJson, topoJson.objects.overlay as GeometryCollection<GeoJsonProperties>).features;
                drawOverlay(overlayName, svg, features, path, waterwayValue, transmissionLineType);
            } else {
                clearOverlay(overlayName, svg);
            }
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
            drawChoropleth(svg, countyFeatures, processedData, colorScheme, path, dispatch, Object.keys(overlays) as OverlayName[]);
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
            for (const overlayName of Object.keys(overlays)) {
                const id = "#" + overlayName.replaceAll(" ", "-");
                svg.select(id)
                    .transition()
                    .duration(200)
                    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
            }
        }

        // tooltips
        svg
            .selectAll(".county")
            .on("touchmove mousemove", handleCountyMouseOver(selectedDataDefinitions, processedData, selections))
            .on("touchend mouseleave", handleMouseOut);
    }, [map,
        overlays,
        selections,
        state,
        processedData,
        detailedView,
        waterwayValue,
        transmissionLineType,
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
                        ticks={ticks} />
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
            <h3 id="map-title">
                {getTitle(getDataDefinitions(selections), selections)}
                {
                    shouldShowLegend(selections) &&
                    isNormalized(selections) &&
                    <Tooltip
                        classes={tooltipClasses}
                        arrow
                        placement="top"
                        title="The normalized value is the percentile
                                of the raw data. If you select multiple data,
                                we take the mean of the ranked values.">
                        <IconButton aria-label="info">
                            <Info />
                        </IconButton>
                    </Tooltip>
                }
            </h3>
            <svg ref={svgRef} viewBox="0, 0, 1175, 610">
                <g id="counties"></g>
                <g id="states"></g>
                <g id="state-borders"><path /></g>
                {
                    Object.keys(overlays).map(overlayName => <g id={overlayName.replaceAll(" ", "-")}></g>)
                }
                <g id="circles"></g>
                {legends(processedData)}
            </svg>
            {map && <MapControls processedData={processedData} />}
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

export const getDataDefinitions = (selections: DataIdParams[]) => {
    return selections.map(selection => dataDefinitions.get(selection.dataGroup)!);
}

export const getLegendTitle = (selectedDataDefinitions: DataDefinition[], selections: DataIdParams[]) => {
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

function drawOverlay(
    overlayName: OverlayName,
    svg: SVGSelection,
    features: Feature<Geometry, GeoJsonProperties>[],
    path: GeoPath<any, GeoPermissibleObjects>,
    waterwayValue: WaterwayValue,
    transmissionLineType: TransmissionLineType,
) {
    let strokeWidth: ((d: Feature<Geometry, GeoJsonProperties>) => number);
    let color: string | ((d: Feature<Geometry, GeoJsonProperties>) => string);
    switch (overlayName) {
        case "Highways":
            strokeWidth = d => 1 / d.properties!.scalerank * 5;
            color = () => "grey";
            break;
        case "Marine highways":
            strokeWidth = d => Math.sqrt(d.properties![waterwayValue] / 5_000_000);
            color = () => "#0099ff";
            break;
        case "Transmission lines":
            strokeWidth = d => d.properties!.V >= 345 ? 2 : 1;
            color = d => d.properties!.V < 345 ? "#1b9e77" : "#d95f02";
            switch (transmissionLineType) {
                case "Level 2 (230kV-344kV)":
                    features = features.filter(d => d.properties!.V < 345);
                    break;
                case "Level 3 (>= 345kV)":
                    features = features.filter(d => d.properties!.V >= 345);
                    break;
            }
            break;
        case "Major railroads":
            strokeWidth = () => 1;
            color = () => "grey";
            break;
    }
    svg.select("#" + overlayName.replaceAll(" ", "-"))
        .selectAll("path")
        .data(features)
        .join("path")
        .attr("stroke", color)
        .attr("fill", "none")
        .attr("stroke-width", strokeWidth)
        .attr("d", path);
};

function clearOverlay(overlayName: OverlayName, svg: SVGSelection) {
    svg.select("#" + overlayName.replaceAll(" ", "-")).selectAll("*").remove();
}

function drawChoropleth(
    svg: SVGSelection,
    countyFeatures: Feature<Geometry, GeoJsonProperties>[],
    processedData: ImmutableMap<string, number | undefined>,
    colorScheme: ColorScheme,
    path: GeoPath<any, GeoPermissibleObjects>,
    dispatch: typeof store.dispatch,
    overlayNames: OverlayName[],
) {
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
    for (const overlayName of overlayNames) {
        const id = "#" + overlayName.replaceAll(" ", "-");
        svg.select(id)
            .transition()
            .duration(200)
            .attr("transform", "translate(0)scale(1)");
    }
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