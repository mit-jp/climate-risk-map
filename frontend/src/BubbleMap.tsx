import { geoPath, ScalePower, scaleSqrt } from 'd3'
import type { Feature, GeoJsonProperties, Geometry } from 'geojson'
import { Map } from 'immutable'
import { GeoId, GeoMap } from './appSlice'
import BubbleLegend from './BubbleLegend'
import { countries, USACounties, features } from './ChoroplethMap'
import { getDomain } from './DataProcessor'
import EmptyMap from './EmptyMap'
import StateMap from './StateMap'

const BUBBLE_TRANSITION = { transition: 'r 0.3s ease-in-out' }

type Props = {
    map: GeoMap
    data: Map<GeoId, number>
    legendTitle: string
    color: string
}
const makeRegionToRadius =
    (valueToRadius: ScalePower<number, number, never>, data: Map<GeoId, number>) =>
    (county: Feature<Geometry, GeoJsonProperties>) => {
        const value = data.get(Number(county.id)) ?? 0
        return valueToRadius(value)
    }

function BubbleMap({ map, data, legendTitle, color }: Props) {
    const path = geoPath()
    let regions
    switch (map.region) {
        case 'USA':
            regions = USACounties(map.topoJson)
            break
        case 'World':
            regions = countries(map.topoJson)
            break
        case 'GriddedWorld':
            regions = features(map.topoJson)
            break
        default:
            regions = USACounties(map.topoJson)
            break
    }
    const { max } = getDomain(data)
    const valueToRadius = scaleSqrt([0, max], [0, 40])
    const regionToRadius = makeRegionToRadius(valueToRadius, data)

    return (
        <>
            <EmptyMap map={map} />
            {map.region === 'USA' && <StateMap topoJson={map.topoJson} />}
            <g>
                {regions.map((region) => (
                    <circle
                        style={BUBBLE_TRANSITION}
                        key={region.id}
                        transform={`translate(${path.centroid(region)})`}
                        r={regionToRadius(region)}
                        stroke="#fff"
                        fill={color}
                        strokeOpacity={0.5}
                        fillOpacity={0.5}
                    />
                ))}
            </g>
            <BubbleLegend radius={valueToRadius} title={legendTitle} />
        </>
    )
}

export default BubbleMap
