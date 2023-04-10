import { geoPath } from 'd3'
import { mesh } from 'topojson-client'
import type { GeometryCollection } from 'topojson-specification'
import { ZOOM_TRANSITION } from './MapWrapper'
import { TopoJson } from './TopoJson'

function StateMap({ topoJson, transform }: { topoJson: TopoJson; transform?: string }) {
    return (
        <g id="states" transform={transform} style={ZOOM_TRANSITION}>
            <path
                d={
                    geoPath()(
                        mesh(
                            topoJson,
                            topoJson.objects.states as GeometryCollection,
                            (a, b) => a !== b
                        )
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
