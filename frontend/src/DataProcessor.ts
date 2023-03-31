import { scaleSequentialQuantile, sum } from 'd3'
import { Map, Set } from 'immutable'
import { Data, DataByMapVisualization } from './MapApi'

export type ProcessedData = Map<string, number | undefined>
type Params = {
    mapId: number
    weight?: number
    invertNormalized: boolean
}

const filterData = (data: Data, filter?: (geoId: string) => boolean): [string, number][] =>
    Object.entries(data).filter(
        ([geoId, value]) => value !== null && value !== undefined && (!filter || filter(geoId))
        // need explicit cast because typescript doesn't know we're filtering out null values
    ) as [string, number][]

const normalizeData = (params: Params, totalWeight: number, valueByGeoId: Map<string, number>) => {
    let weight = params.weight ?? 1
    weight = totalWeight === 0 ? 0 : weight / totalWeight
    const normalizedValueByGeoId = params.invertNormalized
        ? valueByGeoId.map((value) => -1 * value)
        : valueByGeoId

    const weightedPercentileScale = scaleSequentialQuantile(
        normalizedValueByGeoId.valueSeq(),
        (quantile) => quantile * weight
    )
    return normalizedValueByGeoId.map((value) => weightedPercentileScale(value))
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

const dataIsLoaded = (data: DataByMapVisualization, params: Params[]) => {
    const loadedDatasets = Object.keys(data).map((id) => parseInt(id, 10))
    return params.every((map) => loadedDatasets.includes(map.mapId))
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

/**
 * Add and normalize data for the selected datasets
 *
 * @param data A dictionary of map ids to the data for that map
 * @param params What to weight each map by and whether or not to invert it
 * @param filter A function to filter geo ids by
 * @param normalize whether or not to normalize after adding
 * @param geoIds All the county ids or country ids
 * @returns A dictionary of geo ids to the normalized values for those geo ids
 */
const DataProcessor = ({
    data,
    params,
    filter,
    normalize = false,
}: {
    data: Record<number, Data>
    params: Params[]
    filter?: (geoId: string) => boolean
    normalize?: boolean
}): Map<string, number> | undefined => {
    if (params.length === 0 || !dataIsLoaded(data, params)) {
        return undefined
    }
    const totalWeight = sum(params, (param) => param.weight ?? 1)

    const allProcessedData: Map<string, number>[] = []

    params.forEach((map) => {
        const filteredData = Map(filterData(data[map.mapId], filter))
        if (normalize) {
            allProcessedData.push(normalizeData(map, totalWeight, filteredData))
        } else {
            allProcessedData.push(filteredData)
        }
    })

    const geoIdsForEachSelection = allProcessedData.map((dataByGeoId) =>
        dataByGeoId.keySeq().toSet()
    )
    const geoIdsInAllSelections = intersect(geoIdsForEachSelection)
    const mergedData = Map<string, number>().mergeWith(
        (oldVal, newVal) => oldVal + newVal,
        ...allProcessedData
    )
    return mergedData.filter((_, key) => geoIdsInAllSelections.includes(key))
}

export default DataProcessor
