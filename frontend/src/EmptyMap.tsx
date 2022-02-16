import { feature } from 'topojson-client'
import { geoPath } from 'd3'
import type { GeoJsonProperties } from 'geojson'
import type { GeometryCollection } from 'topojson-specification'
import { TopoJson } from './TopoJson'
import { ZOOM_TRANSITION } from './MapWrapper'

function EmptyMap({ map, transform }: { map: TopoJson; transform?: string }) {
    const nation = feature(
        map,
        map.objects.nation as GeometryCollection<GeoJsonProperties>
    ).features
    return (
        <g transform={transform} style={ZOOM_TRANSITION}>
            {nation.map((n) => (
                <path
                    key="nation"
                    d={geoPath()(n)!}
                    stroke="white"
                    fill="#eee"
                    strokeLinejoin="round"
                />
            ))}
        </g>
    )
}

export default EmptyMap
