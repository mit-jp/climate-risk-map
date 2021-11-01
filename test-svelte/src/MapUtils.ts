import { max, scaleSqrt } from "d3";
import type { ScalePower } from "d3";
import type { GeoFeature } from "./GeoFeature";
import type { Data } from "./DataApi";
import type {
    Objects,
    Topology,
} from "topojson-specification";
import type { GeoJsonProperties } from "geojson";

export const makeValueToRadius = (
    counties: GeoFeature[],
    data: Data,
): ScalePower<number, number, never> => {
    let radius: ScalePower<number, number, never>;
    if (data !== undefined) {
        const values = counties
            .map((d) => data[d.id as string])
            .filter((d) => d !== undefined)
            .map((d) => d as number);
        radius = scaleSqrt([0, max(values) ?? 0], [0, 40]);
    } else {
        radius = scaleSqrt([0, 0], [0, 40]);
    }
    return radius;
}

export const makeCountyToRadius =
    (
        valueToRadius: ScalePower<number, number, never>,
        data: Data,
    ) =>
        (county: GeoFeature) => {
            const value = data[county.id as string] ?? 0;
            return valueToRadius(value);
        };

export type TopoJson = Topology<Objects<GeoJsonProperties>>;