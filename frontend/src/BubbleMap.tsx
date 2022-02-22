import { Map } from 'immutable'
import { geoPath, ScalePower, scaleSqrt } from 'd3'
import { feature } from 'topojson-client'
import type { GeometryCollection } from 'topojson-specification'
import type { GeoJsonProperties, Geometry, Feature } from 'geojson'
import { TopoJson } from './TopoJson'
import StateMap from './StateMap'
import EmptyMap from './EmptyMap'
import BubbleLegend from './BubbleLegend'
import { getDomain } from './DataProcessor'

const BUBBLE_TRANSITION = { transition: 'r 0.3s ease-in-out' }

type Props = {
    map: TopoJson
    data: Map<string, number>
    legendTitle: string
    color: string
}
const makeCountyToRadius =
    (valueToRadius: ScalePower<number, number, never>, data: Map<string, number>) =>
    (county: Feature<Geometry, GeoJsonProperties>) => {
        const value = data.get(county.id as string) ?? 0
        return valueToRadius(value)
    }

function BubbleMap({ map, data, legendTitle, color }: Props) {
    const path = geoPath()
    const counties = feature(
        map,
        map.objects.counties as GeometryCollection<GeoJsonProperties>
    ).features
    const { max } = getDomain(data)
    const valueToRadius = scaleSqrt([0, max], [0, 40])
    const countyToRadius = makeCountyToRadius(valueToRadius, data)

    return (
        <>
            <EmptyMap map={map} />
            <StateMap map={map} />
            <g>
                {counties.map((county) => (
                    <circle
                        style={BUBBLE_TRANSITION}
                        key={county.id}
                        transform={`translate(${path.centroid(county)})`}
                        r={countyToRadius(county)}
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
