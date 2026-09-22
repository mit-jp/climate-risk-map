import {
    getDataQueryParams,
    getDefaultDateRange,
    getDefaultSelection,
    getDefaultSource,
    jsonToMapVisualization,
} from './MapVisualization'
import {
    interval,
    makeEmptyMapVisualization,
    makeMapVisualization,
    makeMapVisualizationJson,
} from './test-fixtures'

describe('a map visualization with data', () => {
    const mapVisualization = makeMapVisualization()

    test('defaults to the first source and the last date range', () => {
        expect(getDefaultSource(mapVisualization)).toEqual(12)
        expect(getDefaultDateRange(mapVisualization)).toEqual(interval(2015, 2015))
    })

    test('prefers the configured default source and date range', () => {
        const withDefaults = makeMapVisualization({
            default_source: 12,
            default_date_range: interval(2014, 2014),
        })
        expect(getDefaultSource(withDefaults)).toEqual(12)
        expect(getDefaultDateRange(withDefaults)).toEqual(interval(2014, 2014))
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

    test('drops a stale default_source when there is no data', () => {
        const mapVisualization = jsonToMapVisualization(
            makeMapVisualizationJson({
                sources: {},
                date_ranges_by_source: {},
                default_source: 12,
            })
        )
        expect(mapVisualization.hasData).toBe(false)
        expect(mapVisualization.default_source).toBeUndefined()
    })

    test('treats sources whose date ranges are all empty as not hasData', () => {
        const mapVisualization = jsonToMapVisualization(
            makeMapVisualizationJson({ date_ranges_by_source: { 12: [] } })
        )
        expect(mapVisualization.hasData).toBe(false)
    })

    test('drops a source with no date ranges from sources too, keeping the keys aligned', () => {
        const mapVisualization = jsonToMapVisualization(
            makeMapVisualizationJson({
                sources: {
                    12: { id: 12, name: 'Test source', description: '', link: '' },
                    13: { id: 13, name: 'Empty source', description: '', link: '' },
                },
                date_ranges_by_source: {
                    12: [{ start_date: '2015-01-01', end_date: '2015-12-31' }],
                    13: [],
                },
            })
        )
        expect(mapVisualization.hasData).toBe(true)
        expect(Object.keys(mapVisualization.sources)).toEqual(['12'])
        expect(Object.keys(mapVisualization.date_ranges_by_source)).toEqual(['12'])
    })

    test('keeps a default_source that has date ranges', () => {
        const mapVisualization = jsonToMapVisualization(
            makeMapVisualizationJson({ default_source: 12 })
        )
        expect(mapVisualization.default_source).toEqual(12)
    })

    test('drops a default_source pointing at a source with no date ranges', () => {
        const mapVisualization = jsonToMapVisualization(
            makeMapVisualizationJson({
                date_ranges_by_source: {
                    12: [{ start_date: '2015-01-01', end_date: '2015-12-31' }],
                    13: [],
                },
                default_source: 13,
            })
        )
        expect(mapVisualization.hasData).toBe(true)
        expect(mapVisualization.default_source).toBeUndefined()
    })
})
