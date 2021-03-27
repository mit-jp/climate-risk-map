import { scaleSequentialQuantile } from 'd3';
import { Map, Seq, Set } from 'immutable';
import counties from './Counties';
import dataDefinitions, { DataGroup, DataIdParams, DataType, Normalization } from './DataDefinitions';
import { CsvFile, Data } from './Home';
import { State } from './States';

export type ProcessedData = Map<string, number | undefined>;

const getTablesForSelections = (selections: DataIdParams[], state: State | undefined) => {
    return Map(selections.map(selection => {
        const dataDefinition = dataDefinitions.get(selection.dataGroup)!
        const csvFile: CsvFile = dataDefinition.type === DataType.Climate || dataDefinition.type === DataType.Water ? "climate.csv" : "demographics.csv";
        return [selection, csvFile];
    }));
}

const getDataForSelection = (
    countyIds: Seq.Indexed<string>,
    selection: DataIdParams,
    selectionToTable: Map<DataIdParams, CsvFile>,
    selectionToDataId: Map<DataIdParams, string>,
    data: Data,
) => {
    const dataForSelection: [string, number][] = [];
    const tableName = selectionToTable.get(selection)!;
    const dataId = selectionToDataId.get(selection)!;
    const table = data.get(tableName)!;

    for (const countyId of countyIds) {
        const countyValues = table.get(countyId);
        if (countyValues === undefined) {
            continue;
        }
        const value = countyValues[dataId];
        if (value === undefined) {
            continue;
        }
        dataForSelection.push([countyId, +value]);
    }
    return dataForSelection;
}

const shouldInvert = (selection: DataIdParams) => {
    // Large values in the drought and groundwater measurements
    // correspond with low risk, not high risk
    switch(selection.dataGroup) {
        case DataGroup.DroughtIndicator:
        case DataGroup.Groundwater:
            return true;
        default:
            return false;
    }
}

const normalizeData = (
    dataWeights: Map<DataGroup, number>,
    selection: DataIdParams,
    totalWeight: number,
    valueByCountyId: Map<string, number>
) => {
    let weight = (dataWeights.get(selection.dataGroup) ?? 1);
    weight = totalWeight === 0 ? 0 : weight / totalWeight;
    valueByCountyId = shouldInvert(selection) ?
        valueByCountyId.map(value => -1 * value) :
        valueByCountyId;

    const weightedPercentileScale = scaleSequentialQuantile(valueByCountyId.valueSeq(), quantile => quantile * weight);
    return valueByCountyId.map(value => weightedPercentileScale(value));
}

const dataLoaded = (csvFiles: IterableIterator<CsvFile>, data: Data) => {
    for (const csvFile of csvFiles) {
        if (data.get(csvFile) === undefined) {
            return false;
        }
    }
    return true;
}

const processData = (
    selections: DataIdParams[],
    data: Data,
    dataWeights: Map<DataGroup, number>,
    state: State | undefined,
) => {
    const selectionToDataId = getDataIdsForSelections(selections);
    const selectionToTable = getTablesForSelections(selections, state);
    const dataGroups = selections.map(selection => selection.dataGroup);
    const shouldNormalize = selections[0]?.normalization === Normalization.Percentile;

    let totalWeight = 0;
    for(const dataGroup of dataGroups) {
        totalWeight += dataWeights.get(dataGroup) ?? 1;
    }

    let countyIds = counties.keySeq();
    if (state) {
        countyIds = countyIds.filter(stateFilter(state));
    }

    const allProcessedData: Map<string, number>[] = [];

    for (const selection of selections) {
        const valueToCountyId = Map(getDataForSelection(
            countyIds,
            selection,
            selectionToTable,
            selectionToDataId,
            data,
        ));
        if (shouldNormalize) {
            allProcessedData.push(normalizeData(dataWeights, selection, totalWeight, valueToCountyId));
        } else {
            allProcessedData.push(valueToCountyId);
        }
    }

    const countyIdsForEachSelection = allProcessedData.map(dataByCountyId => dataByCountyId.keySeq().toSet());
    const countyIdsInAllSelections = intersect(countyIdsForEachSelection);
    const mergedData = Map<string, number>().mergeWith((oldVal, newVal) => oldVal + newVal, ...allProcessedData);
    return mergedData.filter((_, key) => countyIdsInAllSelections.includes(key));
}

const intersect = (sets: Set<string>[]) => {
    if (sets.length > 1) {
        const first_set = sets[0];
        const other_sets = sets.slice(1, sets.length);
        return first_set.intersect(...other_sets);
    } else if (sets.length === 1) {
        return sets[0];
    } else {
        return Set();
    }
}

const getDataIdsForSelections = (selections: DataIdParams[]) =>
    Map(selections.map(selection =>
        [selection, dataDefinitions.get(selection.dataGroup)!.id(selection)]
    ));

export default (data: Data, selections: DataIdParams[], dataWeights: Map<DataGroup, number>, state: State | undefined) => {
    const tables = getTablesForSelections(selections, state);
    if (selections.length === 0 || !dataLoaded(tables.values(), data)) {
        return undefined;
    }
    return processData(selections, data, dataWeights, state);
}

export const stateFilter = (state: State) => (county: string) => {
    if (state === undefined) {
        return true;
    }
    return county.slice(0, 2) === state;
}
