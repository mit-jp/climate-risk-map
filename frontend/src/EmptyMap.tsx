import { geoPath } from 'd3'
import type { GeoJsonProperties } from 'geojson'
import { feature } from 'topojson-client'
import type { GeometryCollection } from 'topojson-specification'
import { ZOOM_TRANSITION } from './MapWrapper'
import { GeoMap } from './appSlice'

const path = geoPath()

function EmptyMap({ map, transform }: { map: GeoMap; transform?: string }) {
    const geometry =
        map.region === 'USA' ? map.topoJson.objects.nation : map.topoJson.objects.countries
    const borders = feature(
        map.topoJson,
        geometry as GeometryCollection<GeoJsonProperties>
    ).features

    return (
        <g transform={transform} style={ZOOM_TRANSITION}>
            {borders.map((region) => (
                <path
                    key={map.region === 'USA' ? 'nation' : region.id}
                    d={path(region)!}
                    stroke="white"
                    fill="#eee"
                    strokeLinejoin="round"
                />
            ))}
        </g>
    )
}

export default EmptyMap
