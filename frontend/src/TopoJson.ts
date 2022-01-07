import { Objects, Topology } from 'topojson-specification'
import type { GeoJsonProperties } from 'geojson'

export type TopoJson = Topology<Objects<GeoJsonProperties>>
