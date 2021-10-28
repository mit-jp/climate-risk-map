import * as scales from 'd3-scale-chromatic';
import { scaleSequential, scaleThreshold, scaleDiverging, scaleDivergingSymlog, scaleSequentialSqrt } from 'd3';
import type { ScaleSequential, ScaleThreshold, ScaleDiverging } from 'd3';
import type { MapConfig } from "./MapConfigApi";

const Color = (map: MapConfig): ColorScheme => {
    const domain = map.scale_domain;
    const colorPalette = map.color_palette.name;
    const interpolator: (x: number) => string = map.reverse_scale
        ? x => (scales as any)["interpolate" + colorPalette](1 - x)
        : (scales as any)["interpolate" + colorPalette];
    const scale: ReadonlyArray<string> = (scales as any)["scheme" + colorPalette][domain.length];
    const type = map.scale_type.name;

    switch (type) {
        case "Diverging": return scaleDiverging(domain, interpolator);
        case "Sequential": return scaleSequential(domain, interpolator);
        case "Threshold": return scaleThreshold(domain, scale);
        case "DivergingSymLog": return scaleDivergingSymlog(domain, interpolator);
        case "SequentialSqrt": return scaleSequentialSqrt(domain, interpolator);
        default: throw new Error(`Unknown scale type: ${type}`);
    }
};

export const simpleColor = (map: MapConfig): ColorScheme => {
    const colorPalette = map.color_palette.name;
    const interpolator: (x: number) => string = map.reverse_scale
        ? x => (scales as any)["interpolate" + colorPalette](1 - x)
        : (scales as any)["interpolate" + colorPalette];
    const type = map.scale_type.name;

    switch (type) {
        case "Diverging": return scaleDiverging(interpolator);
        case "Sequential": return scaleSequential(interpolator);
        case "Threshold": return scaleThreshold((scales as any)["scheme" + colorPalette][map.scale_domain.length]);
        case "DivergingSymLog": return scaleDivergingSymlog(interpolator);
        case "SequentialSqrt": return scaleSequentialSqrt(interpolator);
        default: throw new Error(`Unknown scale type: ${type}`);
    }
}

export default Color;

export type ColorScheme = ScaleSequential<string, never> | ScaleThreshold<number, string, never> | ScaleDiverging<string, never>;
