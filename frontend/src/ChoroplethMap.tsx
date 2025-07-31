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
import { MapVisualization } from './MapVisualization'
import { ZOOM_TRANSITION } from './MapWrapper'
import StateMap from './StateMap'
import { TopoJson } from './TopoJson'
import { GeoId, GeoMap, clickMap } from './appSlice'

const MISSING_DATA_COLOR = '#ccc'

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
    isNormalized: boolean
    transform?: string
}

function ChoroplethMap(
    { map, selectedMapVisualizations, data, detailedView, isNormalized, transform }: Props,
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
        </>
    )
}

const ChoroplethMapForwardRef = forwardRef(ChoroplethMap)

export default ChoroplethMapForwardRef
