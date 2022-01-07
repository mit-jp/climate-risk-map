import { geoPath } from 'd3'
import { GeometryCollection } from 'topojson-specification'
import { mesh } from 'topojson-client'
import { TopoJson } from './TopoJson'
import { ZOOM_TRANSITION } from './MapWrapper'

function StateMap({ map, transform }: { map: TopoJson; transform?: string }) {
    return (
        <g id="states" transform={transform} style={ZOOM_TRANSITION}>
            <path
                d={
                    geoPath()(
                        mesh(map, map.objects.states as GeometryCollection, (a, b) => a !== b)
                    )!
                }
                stroke="white"
                fill="none"
                strokeLinejoin="round"
            />
        </g>
    )
}
export default StateMap
