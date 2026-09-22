import { createNextState } from '@reduxjs/toolkit'
import {
    applyPatch,
    getDataQueryParams,
    getDefaultSelection,
    jsonToMapVisualization,
    MapVisualization,
    selectData,
} from './MapVisualization'
import {
    dateRangeJson,
    interval,
    makeEmptyMapVisualization,
    makeMapVisualization,
    makeMapVisualizationJson,
} from './test-fixtures'

const source = (id: number) => ({
    id,
    name: `Source ${id}`,
    description: 'A source for testing',
    link: '',
})

/** Two sources: 12 with 2014 and 2015, and 13 with 2010 and 2011 */
const makeTwoSourceMapVisualization = (
    overrides: Parameters<typeof makeMapVisualization>[0] = {}
) =>
    makeMapVisualization({
        sources: { 12: source(12), 13: source(13) },
        date_ranges_by_source: {
            12: [dateRangeJson(2014, 2014), dateRangeJson(2015, 2015)],
            13: [dateRangeJson(2010, 2010), dateRangeJson(2011, 2011)],
        },
        ...overrides,
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
            dateRange: interval(2015, 2015),
        })
    })

    test('prefers the configured default source and date range', () => {
        const withDefaults = makeTwoSourceMapVisualization({
            default_source: 13,
            default_date_range: dateRangeJson(2010, 2010),
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
    test('joins each source with its date ranges', () => {
        const { sources } = dataOf(jsonToMapVisualization(makeMapVisualizationJson()))
        expect(sources).toEqual({
            12: {
                ...source(12),
                name: 'Test source',
                dateRanges: [interval(2015, 2015)],
                defaultDateRange: interval(2015, 2015),
            },
        })
    })

    test('has no data when there are no sources or date ranges', () => {
        const mapVisualization = jsonToMapVisualization(
            makeMapVisualizationJson({ sources: {}, date_ranges_by_source: {} })
        )
        expect(mapVisualization.data).toBeUndefined()
    })

    test('uses the configured default source', () => {
        const data = dataOf(makeTwoSourceMapVisualization({ default_source: 13 }))
        expect(data.defaultSource).toBe(data.sources[13])
    })

    test('uses the configured default date range only for sources that have it', () => {
        const data = dataOf(
            makeTwoSourceMapVisualization({ default_date_range: dateRangeJson(2014, 2014) })
        )
        expect(data.sources[12]?.defaultDateRange).toEqual(interval(2014, 2014))
        expect(data.sources[13]?.defaultDateRange).toEqual(interval(2011, 2011))
    })

    test('keeps the configured defaults for the editor', () => {
        const mapVisualization = makeTwoSourceMapVisualization({
            default_source: 13,
            default_date_range: dateRangeJson(2010, 2010),
        })
        expect(mapVisualization.default_source).toEqual(13)
        expect(mapVisualization.default_date_range).toEqual(interval(2010, 2010))
    })
})

describe('selectData', () => {
    const data = dataOf(makeTwoSourceMapVisualization())

    test('uses the preferred source and date range when the map has them', () => {
        const { source: selected, dateRange } = selectData(data, {
            source: 13,
            dateRange: interval(2010, 2010),
        })
        expect(selected.id).toEqual(13)
        expect(dateRange).toEqual(interval(2010, 2010))
    })

    test('matches date ranges by value, not by reference', () => {
        const other = dataOf(makeMapVisualization({ id: 72 }))
        const previous = selectData(other, { dateRange: interval(2014, 2014) }).dateRange
        expect(selectData(data, { source: 12, dateRange: previous }).dateRange).toEqual(
            interval(2014, 2014)
        )
    })

    test("falls back to the source's default date range when it lacks the preferred one", () => {
        const { source: selected, dateRange } = selectData(data, {
            source: 13,
            dateRange: interval(2015, 2015),
        })
        expect(selected.id).toEqual(13)
        expect(dateRange).toEqual(interval(2011, 2011))
    })

    test('falls back to the default source when the map lacks the preferred one', () => {
        expect(selectData(data, { source: 99 }).source).toBe(data.defaultSource)
    })
})

describe('applyPatch', () => {
    test('resolves the default source from the patch', () => {
        const mapVisualization = makeTwoSourceMapVisualization()
        const patched = createNextState(mapVisualization, (draft) => {
            applyPatch(draft, { ...mapVisualization, default_source: 13 })
        })
        expect(dataOf(patched).defaultSource.id).toEqual(13)
    })
})
