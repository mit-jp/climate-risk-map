import { mean } from 'd3';
import { Map } from 'immutable';
import counties from './Counties';
import dataDefinitions, { DataGroup, DataId, DataIdParams, DataType, Normalization } from './DataDefinitions';
import { CsvFile, Data } from './Home';
import { State } from './States';

export type ProcessedData = Map<string, number | undefined>;

const getSuffix = (normalization: Normalization, state: State | undefined) => {
    if (state === undefined) {
        return normalizationToFile.get(normalization);
    } else {
        return normalizationToStateFile.get(normalization);
    }
};

const getTablesForSelections = (selections: DataIdParams[], state: State | undefined) => {
    return Map(selections.map(selection => {
        const dataDefinition = dataDefinitions.get(selection.dataGroup)!
        const prefix = dataDefinition.type === DataType.Climate ? "climate" : "demographics";
        const suffix = getSuffix(selection.normalization, state);
        const csvFile: CsvFile = (prefix + suffix) as CsvFile;
        return [selection, csvFile];
    }));
}

const normalizationToFile = Map([
    [Normalization.Raw, ".csv"],
    [Normalization.Percentile, "_normalized_by_nation.csv"],
    [Normalization.StandardDeviations, "_normalized_by_nation_stdv.csv"],
]);

const normalizationToStateFile = Map([
    [Normalization.Raw, ".csv"],
    [Normalization.Percentile, "_normalized_by_state.csv"],
    [Normalization.StandardDeviations, "_normalized_by_state_stdv.csv"],
]);

const getDataForSelections = (
    countyId: string,
    selections: DataIdParams[],
    selectionToTable: Map<DataIdParams, CsvFile>,
    selectionToDataId: Map<DataIdParams, DataId>,
    data: Data,
    dataWeights: Map<DataGroup, number>,
) => {
    return selections.map(selection => {
        const tableName = selectionToTable.get(selection)!;
        const dataId = selectionToDataId.get(selection)!;
        const table = data.get(tableName)!;
        const county = table.get(countyId); 
        if (county === undefined) {
            return undefined;
        }
        const value = county[DataId[dataId]];
        if (value === undefined) {
            return undefined;
        }
        return +value * (dataWeights.get(selection.dataGroup) ?? 1);
    });
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
    let valuesById: [string, number | undefined][] = [];
    for (const countyId of counties.keys()) {
        const values = getDataForSelections(
            countyId,
            selections,
            selectionToTable,
            selectionToDataId,
            data,
            dataWeights
        );
        valuesById.push([countyId, mean(values)]);
    }
    return Map<string, number | undefined>(valuesById);
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
