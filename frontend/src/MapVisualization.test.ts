import { getDataQueryParams, getDefaultSelection, jsonToMapVisualization } from './MapVisualization'
import {
    interval,
    makeEmptyMapVisualization,
    makeMapVisualization,
    makeMapVisualizationJson,
} from './test-fixtures'

describe('a map visualization with data', () => {
    const mapVisualization = makeMapVisualization()

    test('defaults to the first source and the last date range', () => {
        expect(getDefaultSelection(mapVisualization)).toEqual({
            mapVisualization: 71,
            dataSource: 12,
            dateRange: interval(2015, 2015),
        })
    })

    test('prefers the configured default source and date range', () => {
        const withDefaults = makeMapVisualization({
            date_ranges_by_source: {
                12: [interval(2014, 2014), interval(2015, 2015)],
                13: [interval(2010, 2010), interval(2011, 2011)],
            },
            default_source: 13,
            default_date_range: interval(2010, 2010),
        })
        expect(getDefaultSelection(withDefaults)).toEqual({
            mapVisualization: 71,
            dataSource: 13,
            dateRange: interval(2010, 2010),
        })
    })

    test('builds data query params', () => {
        expect(getDataQueryParams(mapVisualization)).toEqual([
            {
                mapVisualization: 71,
                source: 12,
                startDate: '2015-01-01',
                endDate: '2015-12-31',
            },
        ])
    })
})

describe('a map visualization whose dataset has no data rows', () => {
    test('has no data query params', () => {
        expect(getDataQueryParams(makeEmptyMapVisualization())).toBeUndefined()
    })

    test('has a default selection without a source or date range', () => {
        expect(getDefaultSelection(makeEmptyMapVisualization())).toEqual({
            mapVisualization: 71,
            dataSource: undefined,
            dateRange: undefined,
        })
    })
})

describe('jsonToMapVisualization', () => {
    test('tags a visualization with data as hasData', () => {
        const mapVisualization = jsonToMapVisualization(makeMapVisualizationJson())
        expect(mapVisualization.hasData).toBe(true)
        expect(mapVisualization.date_ranges_by_source).toEqual({ 12: [interval(2015, 2015)] })
    })

    test('tags empty sources and date ranges as not hasData', () => {
        const mapVisualization = jsonToMapVisualization(
            makeMapVisualizationJson({ sources: {}, date_ranges_by_source: {} })
        )
        expect(mapVisualization.hasData).toBe(false)
        expect(mapVisualization.sources).toEqual({})
        expect(mapVisualization.date_ranges_by_source).toEqual({})
    })

    test('passes default_source through', () => {
        const mapVisualization = jsonToMapVisualization(
            makeMapVisualizationJson({ default_source: 12 })
        )
        expect(mapVisualization.default_source).toEqual(12)
    })
})
