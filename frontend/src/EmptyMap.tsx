import { geoPath } from 'd3'
import type { GeoJsonProperties } from 'geojson'
import { feature } from 'topojson-client'
import type { GeometryCollection } from 'topojson-specification'
import { ZOOM_TRANSITION } from './MapWrapper'
import { GeoMap, Region } from './appSlice'

const path = geoPath()

const OBJECT_NAME_FOR: Record<Region, 'nation' | 'countries' | 'cities'> = {
    USA: 'nation',
    World: 'countries',
    Massachusetts: 'cities',
}

function EmptyMap({ map, transform }: { map: GeoMap; transform?: string }) {
    const objectName = OBJECT_NAME_FOR[map.region]
    const geometry = map.topoJson.objects[objectName]
    const borders = feature(
        map.topoJson,
        geometry as GeometryCollection<GeoJsonProperties>
    ).features

    return (
        <g transform={transform} style={ZOOM_TRANSITION}>
            {borders.map((region) => (
                <path
                    // some countries like Northern Cyprus and Kosovo don't have an id, so use the name instead
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
