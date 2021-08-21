import * as scales from 'd3-scale-chromatic';
import { scaleSequential, scaleThreshold, schemeRdYlBu, ScaleSequential, ScaleThreshold, ScaleDiverging, scaleDiverging, scaleDivergingSymlog, scaleSequentialSqrt } from 'd3';
import chroma from 'chroma-js';
import { MapVisualization } from './FullMap';

const chromaSpectral = chroma.scale(chroma.brewer.Spectral.reverse()).out("hex");
const spectralContinuous = scaleSequential<string>(chromaSpectral);
const redBlue = scaleThreshold<number, string, never>([.05, .25, .75, .95], [...schemeRdYlBu[5]].reverse());

const colorScheme = (map: MapVisualization): ColorScheme => {
    const domain = map.scale_domain;
    const interpolator: (x: number) => string = (scales as any)["interpolate" + map.color_palette];
    const scale: ReadonlyArray<string> = (scales as any)["scheme" + map.color_palette][domain.length];
    // const reverse = map.reverseScale;
    // TODO reverse the color scale if reverse === true
    const type = map.scale_type;

    switch (type) {
        case "Diverging": return scaleDiverging(domain, interpolator);
        case "Sequential": return scaleSequential(domain, interpolator);
        case "Threshold": return scaleThreshold(domain, scale);
        case "DivergingSymLog": return scaleDivergingSymlog(domain, interpolator);
        case "SequentialSqrt": return scaleSequentialSqrt(domain, interpolator);
        default: throw new Error(`Unknown scale type: ${type}`);
    }
};

const Color = (shouldNormalize: boolean, continuous: boolean, map: MapVisualization): ColorScheme => {
    return shouldNormalize ?
        continuous ? spectralContinuous : redBlue :
        colorScheme(map);
}

export default Color;

export type ColorScheme = ScaleSequential<string, never> | ScaleThreshold<number, string, never> | ScaleDiverging<string, never>;
