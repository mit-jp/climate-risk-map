import { geoPath } from 'd3'
import type { GeoJsonProperties } from 'geojson'
import { feature } from 'topojson-client'
import type { GeometryCollection } from 'topojson-specification'
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
        <g transform={transform}>
            {borders.map((region) => (
                <path
                    // some countries like N. Cyprus and Kosovo don't have an id, so use the name instead
                    key={map.region === 'USA' ? 'nation' : region.id && region.properties?.name}
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
