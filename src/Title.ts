import dataDefinitions, { DataIdParams, getUnits } from './DataDefinitions';

const getUnitStringWithParens = (units: string) => units ? ` (${units})` : "";

const getDataDefinitions = (selections: DataIdParams[]) => {
    return selections.map(selection => dataDefinitions.get(selection.dataGroup)!);
}

export default (selections: DataIdParams[]) => {
    const selectedDataDefinitions = getDataDefinitions(selections);
    if (selectedDataDefinitions.length === 1) {
        const dataDefinition = selectedDataDefinitions[0];
        const units = getUnits(dataDefinition, selections[0].normalization);
        return dataDefinition.name + getUnitStringWithParens(units);
    } else {
        const names = selectedDataDefinitions.map(dataDefinition => dataDefinition.name);
        return "Mean of " + names.join(", ");
    }
}