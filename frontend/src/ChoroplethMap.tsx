import { geoPath } from 'd3'
import type { GeoJsonProperties } from 'geojson'
import { Map } from 'immutable'
import { ForwardedRef, forwardRef } from 'react'
import { useDispatch } from 'react-redux'
import { feature } from 'topojson-client'
import type { GeometryCollection } from 'topojson-specification'
import css from './ChoroplethMap.module.css'
import Color from './Color'
import { getDomain } from './DataProcessor'
import { getLegendFormatter } from './Formatter'
import Legend from './Legend'
import { MapType, MapVisualization } from './MapVisualization'
import { ZOOM_TRANSITION } from './MapWrapper'
import ProbabilityDensity from './ProbabilityDensity'
import StateMap from './StateMap'
import { TopoJson } from './TopoJson'
import { GeoId, GeoMap, clickMap } from './appSlice'

const MISSING_DATA_COLOR = '#ccc'

const getLegendTicks = (selectedMaps: MapVisualization[], isNormalized: boolean) =>
    isNormalized ? undefined : selectedMaps[0].legend_ticks

function shouldShowPdf(selectedMaps: MapVisualization[], isNormalized: boolean) {
    const firstSelection = selectedMaps[0]
    if (selectedMaps[0] !== undefined && selectedMaps[0].show_pdf === false) {
        return false
    }
    if (isNormalized) {
        return selectedMaps.length > 1
    }
    return firstSelection !== undefined && firstSelection.map_type === MapType.Choropleth
}

function getPdfDomain(selectedMaps: MapVisualization[]) {
    const firstSelection = selectedMaps[0]
    if (firstSelection === undefined) {
        return undefined
    }

    return firstSelection.pdf_domain
}
const path = geoPath()

export const USACounties = (map: TopoJson) =>
    feature(map, map.objects.counties as GeometryCollection<GeoJsonProperties>).features

export const countries = (map: TopoJson) =>
    feature(map, map.objects.countries as GeometryCollection<GeoJsonProperties>).features

type Props = {
    map: GeoMap
    selectedMapVisualizations: MapVisualization[]
    data: Map<GeoId, number>
    detailedView: boolean
    legendTitle: string
    isNormalized: boolean
    transform?: string
}

function ChoroplethMap(
    {
        map,
        selectedMapVisualizations,
        data,
        detailedView,
        legendTitle,
        isNormalized,
        transform,
    }: Props,
    ref: ForwardedRef<SVGGElement>
) {
    const dispatch = useDispatch()
    const onRegionClicked = (event: any) =>
        Number(event.target?.id) ? dispatch(clickMap(Number(event.target.id))) : null
    const domain = getDomain(data)
    const colorScheme = Color(isNormalized, detailedView, selectedMapVisualizations[0], domain)
    const color = (regionId: number) => {
        const value = data.get(regionId)
        return colorScheme(value as any) ?? MISSING_DATA_COLOR
    }
    const borders = map.region === 'USA' ? USACounties(map.topoJson) : countries(map.topoJson)
    const legendTicks = getLegendTicks(selectedMapVisualizations, isNormalized)
    const legendFormatter = getLegendFormatter(selectedMapVisualizations, isNormalized)
    const getArrayOfData = () =>
        Array.from(data.valueSeq()).filter((value) => value !== undefined) as number[]

    return (
        <>
            <g id={css.counties} transform={transform} style={ZOOM_TRANSITION} ref={ref}>
                {borders.map((region) => (
                    <path
                        key={region.id}
                        id={region.id as string}
                        fill={color(Number(region.id))}
                        d={path(region)!}
                        onClick={onRegionClicked}
                    />
                ))}
            </g>
            {map.region === 'USA' && <StateMap topoJson={map.topoJson} transform={transform} />}
            <Legend
                title={legendTitle}
                colorScheme={colorScheme}
                tickFormat={legendFormatter}
                ticks={legendTicks}
                showHighLowLabels={isNormalized}
                x={map.region === 'World' ? 0 : 875}
                y={map.region === 'World' ? 502 : 500}
                width={290}
                height={60}
            />
            {shouldShowPdf(selectedMapVisualizations, isNormalized) && (
                <ProbabilityDensity
                    data={getArrayOfData()}
                    map={selectedMapVisualizations[0]}
                    xRange={getPdfDomain(selectedMapVisualizations)}
                    formatter={legendFormatter}
                    continuous={detailedView}
                    shouldNormalize={isNormalized}
                    width={290}
                    height={200}
                />
            )}
        </>
    )
}

const ChoroplethMapForwardRef = forwardRef(ChoroplethMap)

export default ChoroplethMapForwardRef
