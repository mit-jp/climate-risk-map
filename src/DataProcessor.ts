import { mean } from 'd3';
import { Map } from 'immutable';
import counties from './Counties';
import dataDefinitions, { DataGroup, DataId, DataIdParams, DataType, Normalization } from './DataDefinitions';
import { CsvFile, Data } from './Home';

export type ProcessedData = Map<string, number | undefined>;

const getTablesForSelections = (selections: DataIdParams[]) => {
    return Map(selections.map(selection => {
        const dataDefinition = dataDefinitions.get(selection.dataGroup)!
        const prefix = dataDefinition.type === DataType.Climate ? "climate" : "demographics";
        const suffix = normalizationToFile.get(selection.normalization);
        const csvFile: CsvFile = (prefix + suffix) as CsvFile;
        return [selection, csvFile];
    }));
}

const normalizationToFile = Map([
    [Normalization.Raw, ".csv"],
    [Normalization.Percentile, "_normalized_by_nation.csv"],
    [Normalization.StandardDeviations, "_normalized_by_nation_stdv.csv"],
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
) => {
    const selectionToDataId = getDataIdsForSelections(selections);
    const selectionToTable = getTablesForSelections(selections);
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

export default (data: Data, selections: DataIdParams[], dataWeights: Map<DataGroup, number>) => {
    const tables = getTablesForSelections(selections);
    if (selections.length === 0 || !dataLoaded(tables.values(), data)) {
        return undefined;
    }
    return processData(selections, data, dataWeights);
}
