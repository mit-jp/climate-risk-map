import dataDefinitions, { DataIdParams, Normalization, percentileColorScheme, standardDeviationColorScheme } from './DataDefinitions';

export default (selections: DataIdParams[]) => {
    const normalization = selections[0].normalization;

    switch(normalization) {
        case Normalization.Raw: return dataDefinitions.get(selections[0].dataGroup)!.color;
        case Normalization.Percentile: return percentileColorScheme;
        case Normalization.StandardDeviations: return standardDeviationColorScheme;
    }        
}