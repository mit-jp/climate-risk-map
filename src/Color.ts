import { scaleSequential, scaleThreshold, schemeRdYlBu } from 'd3';
import dataDefinitions, { DataIdParams, Normalization } from './DataDefinitions';
import { ColorScheme } from './Home';
import chroma from 'chroma-js';

const chromaSpectral = chroma.scale(chroma.brewer.Spectral.reverse()).out("hex");
const spectralContinuous = scaleSequential<string>(chromaSpectral);
const redBlue = scaleThreshold<number, string, never>([.05, .25, .75, .95], [...schemeRdYlBu[5]].reverse());


export default (selections: DataIdParams[], continuous: boolean): ColorScheme => {
    const normalization = selections[0].normalization;
    
    switch(normalization) {
        case Normalization.Raw: return dataDefinitions.get(selections[0].dataGroup)!.color;
        case Normalization.Percentile: return continuous ? spectralContinuous : redBlue;
    }
}