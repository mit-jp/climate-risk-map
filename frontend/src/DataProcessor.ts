import { sum } from 'd3'
import { Map, Set } from 'immutable'
import { Data2 } from './MapApi'
import { MapVisualizationId } from './MapVisualization'
import { GeoId } from './appSlice'

export type ProcessedData = Map<string, number | undefined>
type Params = {
    mapId: number
    weight?: number
    invertNormalized: boolean
}

const normalizeData = (params: Params, totalWeight: number, valueByGeoId: Map<number, number>) => {
    let weight = params.weight ?? 1
    weight = totalWeight === 0 ? 0 : weight / totalWeight
    const normalizedValueByGeoId = params.invertNormalized
        ? valueByGeoId.map((value) => -1 * value)
        : valueByGeoId

    let normalizedValueByGeoIdNonZero = Map<number, number>(
        JSON.parse(JSON.stringify(Array.from(normalizedValueByGeoId)))
    )
    // eslint-disable-next-line no-restricted-syntax
    for (const entry of normalizedValueByGeoIdNonZero) {
        if (entry[1] === 0) {
            normalizedValueByGeoIdNonZero = normalizedValueByGeoIdNonZero.delete(entry[0])
        }
    }
    normalizedValueByGeoIdNonZero = normalizedValueByGeoIdNonZero.set(0, 0)
    const valueListNonZero = normalizedValueByGeoIdNonZero
        .valueSeq()
        .toArray()
        .sort((a, b) => a - b)

    const weightedPercentileScale = (value: number) => {
        const maxValue = Math.max(...valueListNonZero)
        if (value === 0) {
            return 0
        }
        if (value === maxValue) {
            return 1
        }
        // eslint-disable-next-line no-plusplus
        for (let i = 0, l = valueListNonZero.length; i < l; i++) {
            if (value <= valueListNonZero[i]) {
                if (value !== valueListNonZero[i - 1]) {
                    i +=
                        (value - valueListNonZero[i - 1]) /
                        (valueListNonZero[i] - valueListNonZero[i - 1])
                }
                return ((i - 1) / (l - 1)) * weight
            }
        }
        return 1
    }
    return normalizedValueByGeoId.map((value) => weightedPercentileScale(value))
}

const intersect = <T>(sets: Set<T>[]) => {
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

export const getDomain = (
    data: Map<GeoId, number>
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
    filter = () => true,
    normalize = false,
}: {
    data: Map<MapVisualizationId, Data2>
    params: Params[]
    filter?: (geoId: GeoId) => boolean
    normalize?: boolean
}): Map<GeoId, number> | undefined => {
    if (params.length === 0 || !params.every((param) => data.has(param.mapId))) {
        return undefined
    }
    const totalWeight = sum(params, (param) => param.weight ?? 1)

    const allProcessedData: Map<number, number>[] = []

    params.forEach((param) => {
        const filteredData = Map(data.get(param.mapId)!.filter(([geoId]) => filter(geoId)))
        if (normalize) {
            allProcessedData.push(normalizeData(param, totalWeight, filteredData))
        } else {
            allProcessedData.push(filteredData)
        }
    })

    const geoIdsForEachSelection = allProcessedData.map((dataset) => dataset.keySeq().toSet())
    const geoIdsInAllSelections = intersect(geoIdsForEachSelection)
    const mergedData = Map<number, number>().mergeWith(
        (oldVal, newVal) => oldVal + newVal,
        ...allProcessedData
    )
    return mergedData.filter((_, key) => geoIdsInAllSelections.includes(key))
}

export default DataProcessor
