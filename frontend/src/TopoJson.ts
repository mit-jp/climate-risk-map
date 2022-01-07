import { Objects, Topology } from 'topojson-specification'
import { GeoJsonProperties } from 'geojson'

export type TopoJson = Topology<Objects<GeoJsonProperties>>
