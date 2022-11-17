import { Map } from 'immutable'
import { geoPath } from 'd3'
import { feature } from 'topojson-client'
import type { GeometryCollection } from 'topojson-specification'
import type { GeoJsonProperties } from 'geojson'
import { ForwardedRef, forwardRef } from 'react'
import { TopoJson } from './TopoJson'
import Color from './Color'
import StateMap from './StateMap'
import Legend from './Legend'
import ProbabilityDensity from './ProbabilityDensity'
import { clickCounty } from './appSlice'
import { ZOOM_TRANSITION } from './MapWrapper'
import { MapType, MapVisualization } from './MapVisualization'
import css from './ChoroplethMap.module.css'
import { useThunkDispatch } from './Home'
import { getDomain } from './DataProcessor'
import { getLegendFormatter } from './Formatter'

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

const getCountyFeatures = (map: TopoJson) =>
    feature(map, map.objects.counties as GeometryCollection<GeoJsonProperties>).features

type Props = {
    map: TopoJson
    selectedMapVisualizations: MapVisualization[]
    data: Map<string, number>
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
    const dispatch = useThunkDispatch()
    const onCountyClicked = (event: any) =>
        event.target?.id ? dispatch(clickCounty(event.target.id)) : null
    const domain = getDomain(data)
    const colorScheme = Color(isNormalized, detailedView, selectedMapVisualizations[0], domain)
    const color = (countyId: string) => {
        const value = data.get(countyId)
        return colorScheme(value as any) ?? MISSING_DATA_COLOR
    }
    const countyFeatures = getCountyFeatures(map)
    const legendTicks = getLegendTicks(selectedMapVisualizations, isNormalized)
    const legendFormatter = getLegendFormatter(selectedMapVisualizations, isNormalized)
    const getArrayOfData = () =>
        Array.from(data.valueSeq()).filter((value) => value !== undefined) as number[]

    return (
        <>
            <g id={css.counties} transform={transform} style={ZOOM_TRANSITION} ref={ref}>
                {countyFeatures.map((county) => (
                    <path
                        key={county.id}
                        id={county.id as string}
                        fill={color(county.id as string)}
                        d={path(county)!}
                        onClick={onCountyClicked}
                    />
                ))}
            </g>
            <StateMap map={map} transform={transform} />
            <Legend
                title={legendTitle}
                colorScheme={colorScheme}
                tickFormat={legendFormatter}
                ticks={legendTicks}
                showHighLowLabels={isNormalized}
            />
            {shouldShowPdf(selectedMapVisualizations, isNormalized) && (
                <ProbabilityDensity
                    data={getArrayOfData()}
                    map={selectedMapVisualizations[0]}
                    xRange={getPdfDomain(selectedMapVisualizations)}
                    formatter={legendFormatter}
                    continuous={detailedView}
                    shouldNormalize={isNormalized}
                />
            )}
        </>
    )
}

const ChoroplethMapForwardRef = forwardRef(ChoroplethMap)

export default ChoroplethMapForwardRef
