import {
    getDataQueryParams,
    getDefaultSelection,
    jsonToMapVisualization,
    MapVisualization,
    resolveSelection,
    resolveSelections,
} from './MapVisualization'
import {
    interval,
    isoInterval,
    makeEmptyMapVisualization,
    makeMapVisualization,
    makeMapVisualizationJson,
    sourceDateRangesJson,
    sourceJson,
} from './test-fixtures'

/** Two sources: 12 with 2014 and 2015 and the default, and 13 with 2010 and 2011 */
const makeTwoSourceMapVisualization = () =>
    makeMapVisualization({
        sources: {
            default_source: sourceDateRangesJson(sourceJson(12), [2014, 2015]),
            other_sources: [sourceDateRangesJson(sourceJson(13), [2010, 2011])],
        },
    })

const dataOf = (mapVisualization: MapVisualization) => {
    if (mapVisualization.data === undefined) {
        throw new Error('expected a map visualization with data')
    }
    return mapVisualization.data
}

describe('a map visualization with data', () => {
    const mapVisualization = makeMapVisualization()

    test('defaults to the first source and the last date range', () => {
        expect(getDefaultSelection(mapVisualization)).toEqual({
            mapVisualization: 71,
            dataSource: 12,
            dateRange: isoInterval(2015, 2015),
        })
    })

    test('uses the default source and date range from the backend', () => {
        const withDefaults = makeMapVisualization({
            sources: {
                default_source: sourceDateRangesJson(sourceJson(13), [2010, 2011], 2010),
                other_sources: [sourceDateRangesJson(sourceJson(12), [2014, 2015])],
            },
        })
        expect(getDefaultSelection(withDefaults)).toEqual({
            mapVisualization: 71,
            dataSource: 13,
            dateRange: isoInterval(2010, 2010),
        })
    })

    test('builds data query params', () => {
        expect(getDataQueryParams([resolveSelection(mapVisualization)])).toEqual([
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
        expect(getDataQueryParams([resolveSelection(makeEmptyMapVisualization())])).toBeUndefined()
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
    test('parses each source with its date ranges', () => {
        const { sources } = dataOf(makeTwoSourceMapVisualization())
        expect(sources).toEqual({
            12: {
                ...sourceJson(12),
                dateRanges: [interval(2014, 2014), interval(2015, 2015)],
                defaultDateRange: interval(2015, 2015),
            },
            13: {
                ...sourceJson(13),
                dateRanges: [interval(2010, 2010), interval(2011, 2011)],
                defaultDateRange: interval(2011, 2011),
            },
        })
    })

    test('has no data when the backend sends none', () => {
        const mapVisualization = jsonToMapVisualization(makeMapVisualizationJson({ sources: null }))
        expect(mapVisualization.data).toBeUndefined()
    })

    test('uses the default source from the backend', () => {
        const data = dataOf(makeTwoSourceMapVisualization())
        expect(data.defaultSource).toBe(data.sources[12])
    })
})

describe('resolveSelection', () => {
    const mapVisualization = makeTwoSourceMapVisualization()
    const data = dataOf(mapVisualization)

    test('uses the selected source and date range when the map has them', () => {
        const resolved = resolveSelection(mapVisualization, {
            mapVisualization: 71,
            dataSource: 13,
            dateRange: isoInterval(2010, 2010),
        })
        expect(resolved.data?.source.id).toEqual(13)
        expect(resolved.data?.dateRange).toEqual(interval(2010, 2010))
    })

    test("falls back to the source's default date range when it lacks the selected one", () => {
        const resolved = resolveSelection(mapVisualization, {
            mapVisualization: 71,
            dataSource: 13,
            dateRange: isoInterval(2015, 2015),
        })
        expect(resolved.data?.source.id).toEqual(13)
        expect(resolved.data?.dateRange).toEqual(interval(2011, 2011))
    })

    test('falls back to the default source when the map lacks the selected one', () => {
        const resolved = resolveSelection(mapVisualization, {
            mapVisualization: 71,
            dataSource: 99,
        })
        expect(resolved.data?.source).toBe(data.defaultSource)
    })

    test('has no data when the map has none, whatever was selected', () => {
        const resolved = resolveSelection(makeEmptyMapVisualization(), {
            mapVisualization: 71,
            dataSource: 12,
            dateRange: isoInterval(2015, 2015),
        })
        expect(resolved.data).toBeUndefined()
    })
})

describe('resolveSelections', () => {
    test('skips selections whose map visualization is not loaded', () => {
        const mapVisualization = makeMapVisualization()
        const resolved = resolveSelections({ 71: mapVisualization }, [
            { mapVisualization: 71 },
            { mapVisualization: 72 },
        ])
        expect(resolved.map((selection) => selection.mapVisualization)).toEqual([mapVisualization])
    })
})

describe('getDataQueryParams', () => {
    test('skips selections without data', () => {
        const params = getDataQueryParams([
            resolveSelection(makeEmptyMapVisualization({ id: 72 })),
            resolveSelection(makeMapVisualization()),
        ])
        expect(params?.map((param) => param.mapVisualization)).toEqual([71])
    })
})
