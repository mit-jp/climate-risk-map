import type { GeoJsonProperties, Feature, Geometry } from 'geojson';

export type GeoFeature = Feature<Geometry, GeoJsonProperties>;