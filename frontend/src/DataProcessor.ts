import { scaleSequentialQuantile } from 'd3';
import { Map, Seq, Set } from 'immutable';
import { Data, DataByDataset } from './appSlice';
import counties from './Counties';
import { MapVisualizationId } from './DataSelector';
import { MapVisualization } from './FullMap';
import { State } from './States';

export type ProcessedData = Map<string, number | undefined>;

const getDataForSelection = (
    countyIds: Seq.Indexed<string>,
    mapId: MapVisualizationId,
    mapIdToDatasetId: Map<MapVisualizationId, number>,
    data: DataByDataset,
): [string, number][] => {
    const dataForSelection: [string, number][] = [];
    const dataId = mapIdToDatasetId.get(mapId)!;
    const dataMapForSelection: Data = data[dataId];

    for (const countyId of countyIds) {
        const value = dataMapForSelection[countyId];
        if (value === null || value === undefined) {
            continue;
        }
        dataForSelection.push([countyId, value]);
    }
    return dataForSelection;
}

const normalizeData = (
    dataWeights: { [key in MapVisualizationId]?: number },
    map: MapVisualization,
    totalWeight: number,
    valueByCountyId: Map<string, number>
) => {
    let weight = (dataWeights[map.id] ?? 1);
    weight = totalWeight === 0 ? 0 : weight / totalWeight;
    valueByCountyId = map.invert_normalized ?
        valueByCountyId.map(value => -1 * value) :
        valueByCountyId;

    const weightedPercentileScale = scaleSequentialQuantile(valueByCountyId.valueSeq(), quantile => quantile * weight);
    return valueByCountyId.map(value => weightedPercentileScale(value));
}

const processData = (
    selectedMaps: MapVisualization[],
    data: DataByDataset,
    dataWeights: { [key in MapVisualizationId]?: number },
    state: State | undefined,
    shouldNormalize: boolean,
) => {
    const mapIdToDataId = getDatasetIdsForMaps(selectedMaps);

    let totalWeight = 0;
    for (const map of selectedMaps) {
        totalWeight += dataWeights[map.id] ?? 1;
    }

    let countyIds = counties.keySeq();
    if (state) {
        countyIds = countyIds.filter(stateFilter(state));
    }

    const allProcessedData: Map<string, number>[] = [];

    for (const map of selectedMaps) {
        const countyIdToValue = Map(getDataForSelection(
            countyIds,
            map.id,
            mapIdToDataId,
            data,
        ));
        if (shouldNormalize) {
            allProcessedData.push(normalizeData(dataWeights, map, totalWeight, countyIdToValue));
        } else {
            allProcessedData.push(countyIdToValue);
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

const getDatasetIdsForMaps = (maps: MapVisualization[]) =>
    Map(maps.map(map => [map.id, map.dataset]));

const DataProcessor = (
    data: DataByDataset,
    selectedMaps: MapVisualization[],
    dataWeights: { [key in MapVisualizationId]?: number },
    state: State | undefined,
    shouldNormalize: boolean,
) => {
    if (selectedMaps.length === 0 || Object.keys(data).length === 0) {
        return undefined;
    }
    return processData(selectedMaps, data, dataWeights, state, shouldNormalize);
}

export default DataProcessor;

export const stateFilter = (state: State) => (county: string) => {
    if (state === undefined) {
        return true;
    }
    return county.slice(0, 2) === state;
}
