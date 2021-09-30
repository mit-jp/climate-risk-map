import { useThunkDispatch } from "./Home";
import { TopoJson } from "./TopoJson";
import * as React from "react";
import { Map } from "immutable";
import { format, geoPath } from 'd3';
import { feature } from 'topojson-client';
import { GeometryCollection } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import Color from "./Color";
import StateMap from "./StateMap";
import Legend from "./Legend";
import ProbabilityDensity from "./ProbabilityDensity";
import CountyPath from "./CountyPath";
import { hoverCounty, hoverPosition, selectMapTransform } from "./appSlice";
import { useSelector } from "react-redux";
import { ZOOM_TRANSITION } from "./MapWrapper";
import { FormatterType, MapType, MapVisualization } from "./MapVisualization";

const MISSING_DATA_COLOR = "#ccc";

const getLegendTicks = (selectedMaps: MapVisualization[], isNormalized: boolean) =>
    isNormalized ?
        undefined :
        selectedMaps[0].legend_ticks;

export type Formatter = (n: number | { valueOf(): number }) => string;

export const riskMetricFormatter = (d: number | { valueOf(): number; }) =>
    format(".0%")(d).slice(0, -1);

export const createFormatter = (formatterType: FormatterType, decimals: number, isNormalized: boolean) => {
    if (isNormalized) {
        return riskMetricFormatter;
    } else {
        switch (formatterType) {
            case FormatterType.MONEY:
                return format("$,." + decimals + "s");
            case FormatterType.NEAREST_SI_UNIT:
                return format("~s");
            case FormatterType.DEFAULT:
            default:
                return format(",." + decimals + "f");
        }
    }
}
const getLegendFormatter = (selectedMaps: MapVisualization[], isNormalized: boolean): Formatter => {
    const firstMap = selectedMaps[0];
    const formatterType = firstMap.legend_formatter_type ?? firstMap.formatter_type;
    const decimals = firstMap.legend_decimals ?? firstMap.decimals;
    return createFormatter(formatterType, decimals, isNormalized);
}

function shouldShowPdf(selectedMaps: MapVisualization[], isNormalized: boolean) {
    const firstSelection = selectedMaps[0];
    if (selectedMaps[0] !== undefined && selectedMaps[0].show_pdf === false) {
        return false;
    }
    if (isNormalized) {
        return selectedMaps.length > 1;
    }
    return firstSelection !== undefined && firstSelection.map_type === MapType.Choropleth;
}

function getPdfDomain(selectedMaps: MapVisualization[]) {
    const firstSelection = selectedMaps[0];
    if (firstSelection === undefined) {
        return undefined;
    }

    return firstSelection.pdf_domain;
}
const path = geoPath();

const getCountyFeatures = (map: TopoJson) =>
    feature(
        map,
        map.objects.counties as GeometryCollection<GeoJsonProperties>
    ).features;

type Props = {
    map: TopoJson,
    selectedMapVisualizations: MapVisualization[],
    data: Map<string, number>,
    detailedView: boolean,
    legendTitle: string,
    isNormalized: boolean,
    showTooltip?: boolean,
}

const ChoroplethMap = ({ map, selectedMapVisualizations, data, detailedView, legendTitle, isNormalized, showTooltip = false }: Props) => {
    const dispatch = useThunkDispatch();
    const transform = useSelector(selectMapTransform);
    const colorScheme = Color(isNormalized, detailedView, selectedMapVisualizations[0]);
    const color = (countyId: string) => {
        const value = data.get(countyId);
        return colorScheme(value as any) ?? MISSING_DATA_COLOR;
    }
    const countyFeatures = getCountyFeatures(map);
    const legendTicks = getLegendTicks(selectedMapVisualizations, isNormalized);
    const legendFormatter = getLegendFormatter(selectedMapVisualizations, isNormalized);
    const getArrayOfData = () =>
        Array
            .from(data.valueSeq())
            .filter(value => value !== undefined) as number[];
    const onMouseMove = (event: React.MouseEvent<SVGGElement, MouseEvent>) =>
        onMove({ x: event.pageX + 10, y: event.pageY - 25 });
    const onTouchMove = (event: React.TouchEvent<SVGGElement>) =>
        onMove({ x: event.touches[0].pageX + 30, y: event.touches[0].pageY - 45 })
    const onMove = (position: { x: number, y: number }) =>
        dispatch(hoverPosition(position));
    const onHoverEnd = () => dispatch(hoverCounty());

    return (
        <React.Fragment>
            <g
                id="counties"
                onMouseOut={showTooltip ? onHoverEnd : undefined}
                onTouchEnd={showTooltip ? onHoverEnd : undefined}
                onMouseMove={showTooltip ? onMouseMove : undefined}
                onTouchMove={showTooltip ? onTouchMove : undefined}
                transform={transform}
                style={ZOOM_TRANSITION}
            >
                {countyFeatures.map(county =>
                    <CountyPath
                        showTooltip={showTooltip}
                        key={county.id}
                        color={color(county.id as string)}
                        d={path(county)!}
                        id={county.id as string}
                    />
                )}
            </g>
            <StateMap map={map} transform={transform} />
            <Legend
                title={legendTitle}
                color={colorScheme}
                tickFormat={legendFormatter}
                ticks={legendTicks}
                showHighLowLabels={isNormalized}
            />
            {
                shouldShowPdf(selectedMapVisualizations, isNormalized) &&
                <ProbabilityDensity
                    data={getArrayOfData()}
                    map={selectedMapVisualizations[0]}
                    xRange={getPdfDomain(selectedMapVisualizations)}
                    formatter={legendFormatter}
                    continuous={detailedView}
                    shouldNormalize={isNormalized}
                />
            }
        </React.Fragment>
    )
}

export default ChoroplethMap;
