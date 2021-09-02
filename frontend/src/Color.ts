import { scaleSequential, scaleThreshold, schemeRdYlBu, interpolateRdYlBu } from 'd3';
import dataDefinitions, { DataIdParams, Normalization } from './DataDefinitions';
import { ColorScheme } from './Home';

const redBlueContinuous = scaleSequential<string>(x => interpolateRdYlBu(1 - x));
const redBlue = scaleThreshold<number, string, never>([.05, .25, .75, .95], [...schemeRdYlBu[5]].reverse());


const Color = (selections: DataIdParams[], continuous: boolean): ColorScheme => {
    const normalization = selections[0].normalization;

    switch (normalization) {
        case Normalization.Raw: return dataDefinitions.get(selections[0].dataGroup)!.color;
        case Normalization.Percentile: return continuous ? redBlueContinuous : redBlue;
    }
}

export default Color;