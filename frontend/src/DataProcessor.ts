import { scaleSequentialQuantile } from 'd3'
import { Map, Seq, Set } from 'immutable'
import { Data, DataByMapVisualization } from './MapApi'
import counties from './Counties'
import { MapVisualization, MapVisualizationId } from './MapVisualization'
import { State } from './States'

export type ProcessedData = Map<string, number | undefined>

const getDataForSelection = (
    countyIds: Seq.Indexed<string>,
    mapId: MapVisualizationId,
    data: DataByMapVisualization
): [string, number][] => {
    const dataForSelection: [string, number][] = []
    const dataMapForSelection: Data = data[mapId]

    countyIds.forEach((countyId) => {
        const value = dataMapForSelection[countyId]
        if (value !== null && value !== undefined) {
            dataForSelection.push([countyId, value])
        }
    })
    return dataForSelection
}

const normalizeData = (
    dataWeights: { [key in MapVisualizationId]?: number },
    map: MapVisualization,
    totalWeight: number,
    valueByCountyId: Map<string, number>
) => {
    let weight = dataWeights[map.id] ?? 1
    weight = totalWeight === 0 ? 0 : weight / totalWeight
    const normalizedValueByCountyId = map.invert_normalized
        ? valueByCountyId.map((value) => -1 * value)
        : valueByCountyId

    const weightedPercentileScale = scaleSequentialQuantile(
        normalizedValueByCountyId.valueSeq(),
        (quantile) => quantile * weight
    )
    return normalizedValueByCountyId.map((value) => weightedPercentileScale(value))
}

const intersect = (sets: Set<string>[]) => {
    if (sets.length > 1) {
        const firstSet = sets[0]
        const otherSets = sets.slice(1, sets.length)
        return firstSet.intersect(...otherSets)
    }
    if (sets.length === 1) {
        return sets[0]
    }
    return Set()
}

export const stateFilter = (state: State) => (county: string) => {
    if (state === undefined) {
        return true
    }
    return county.slice(0, 2) === state
}

const processData = (
    selectedMaps: MapVisualization[],
    data: DataByMapVisualization,
    dataWeights: Record<MapVisualizationId, number>,
    state: State | undefined,
    shouldNormalize: boolean
): Map<string, number> => {
    let totalWeight = 0
    selectedMaps.forEach((map) => {
        totalWeight += dataWeights[map.id] ?? 1
    })

    let countyIds = counties.keySeq()
    if (state) {
        countyIds = countyIds.filter(stateFilter(state))
    }

    const allProcessedData: Map<string, number>[] = []

    selectedMaps.forEach((map) => {
        const countyIdToValue = Map(getDataForSelection(countyIds, map.id, data))
        if (shouldNormalize) {
            allProcessedData.push(normalizeData(dataWeights, map, totalWeight, countyIdToValue))
        } else {
            allProcessedData.push(countyIdToValue)
        }
    })

    const countyIdsForEachSelection = allProcessedData.map((dataByCountyId) =>
        dataByCountyId.keySeq().toSet()
    )
    const countyIdsInAllSelections = intersect(countyIdsForEachSelection)
    const mergedData = Map<string, number>().mergeWith(
        (oldVal, newVal) => oldVal + newVal,
        ...allProcessedData
    )
    return mergedData.filter((_, key) => countyIdsInAllSelections.includes(key))
}

const dataIsLoaded = (data: DataByMapVisualization, selectedMaps: MapVisualization[]) => {
    const loadedDatasets = Object.keys(data).map((id) => parseInt(id, 10))
    return selectedMaps.every((map) => loadedDatasets.includes(map.id))
}

const DataProcessor = (
    data: DataByMapVisualization,
    selectedMaps: MapVisualization[],
    dataWeights: Record<MapVisualizationId, number>,
    state: State | undefined,
    shouldNormalize: boolean
): Map<string, number> | undefined => {
    if (selectedMaps.length === 0 || !dataIsLoaded(data, selectedMaps)) {
        return undefined
    }
    return processData(selectedMaps, data, dataWeights, state, shouldNormalize)
}

export const getDomain = (
    data: Map<string, number>
): { min: number; median: number; max: number } => {
    const values = data.valueSeq().sort()
    return {
        min: values.first() ?? 0,
        median: values.get(Math.floor(values.count() / 2)) ?? 0.5,
        max: values.last() ?? 1,
    }
}

export default DataProcessor
