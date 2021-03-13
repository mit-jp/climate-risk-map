import { scaleSequentialQuantile } from 'd3';
import dataDefinitions, { DataIdParams, Normalization } from './DataDefinitions';
import { ColorScheme } from './Home';
import chroma from 'chroma-js';

const chromaSpectral = chroma.scale(chroma.brewer.Spectral.reverse()).out("hex");
const spectralContinuous = (data: number[]) => scaleSequentialQuantile<string>(chromaSpectral).domain(data);

export default (selections: DataIdParams[], data: number[]): ColorScheme => {
    const normalization = selections[0].normalization;
    
    switch(normalization) {
        case Normalization.Raw: return dataDefinitions.get(selections[0].dataGroup)!.color;
        case Normalization.Percentile: return spectralContinuous(data);
    }
}