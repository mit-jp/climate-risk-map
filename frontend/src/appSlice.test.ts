import { Tab } from './MapApi'
import reducer, {
    changeDataSource,
    changeDateRange,
    changeMapSelection,
    setMapSelections,
    setTab,
} from './appSlice'
import {
    interval,
    isoInterval,
    makeEmptyMapVisualization,
    makeMapVisualization,
    sourceDateRangesJson,
    sourceJson,
} from './test-fixtures'

const tab: Tab = { id: 9, name: 'health', normalized: false, order: 1 }

const mapVisualizationWithData = makeMapVisualization()
const emptyMapVisualization = makeEmptyMapVisualization({ id: 72 })

const stateWithSelection = () => {
    let state = reducer(undefined, setTab(tab))
    state = reducer(
        state,
        setMapSelections([
            {
                mapVisualization: mapVisualizationWithData.id,
                dataSource: 12,
                dateRange: isoInterval(2015, 2015),
            },
        ])
    )
    return state
}

const firstSelection = (state: ReturnType<typeof reducer>) =>
    state.mapSelections[state.region][tab.id]?.[0]

describe('changeMapSelection', () => {
    test('clears the source and date range when the map has no data', () => {
        const state = reducer(stateWithSelection(), changeMapSelection(emptyMapVisualization))
        expect(firstSelection(state)).toEqual({
            mapVisualization: emptyMapVisualization.id,
            dataSource: undefined,
            dateRange: undefined,
        })
    })

    test('restores defaults when switching from an empty map back to one with data', () => {
        let state = reducer(stateWithSelection(), changeMapSelection(emptyMapVisualization))
        state = reducer(state, changeMapSelection(mapVisualizationWithData))
        expect(firstSelection(state)).toEqual({
            mapVisualization: mapVisualizationWithData.id,
            dataSource: 12,
            dateRange: isoInterval(2015, 2015),
        })
    })

    test('creates a selection when there is none', () => {
        let state = reducer(undefined, setTab(tab))
        state = reducer(state, setMapSelections([]))
        state = reducer(state, changeMapSelection(mapVisualizationWithData))
        expect(firstSelection(state)).toEqual({
            mapVisualization: mapVisualizationWithData.id,
            dataSource: 12,
            dateRange: isoInterval(2015, 2015),
        })
    })
    test('keeps the previous date range when the new map also has it', () => {
        let state = reducer(stateWithSelection(), changeDateRange(interval(2014, 2014)))
        state = reducer(state, changeMapSelection(makeMapVisualization({ id: 73 })))
        expect(firstSelection(state)).toEqual({
            mapVisualization: 73,
            dataSource: 12,
            dateRange: isoInterval(2014, 2014),
        })
    })
})

describe('changeDateRange', () => {
    test('does nothing when there is no selection', () => {
        let state = reducer(undefined, setTab(tab))
        state = reducer(state, setMapSelections([]))
        state = reducer(state, changeDateRange(interval(2015, 2015)))
        expect(state.mapSelections[state.region][tab.id]).toEqual([])
    })
})

describe('changeDataSource', () => {
    const twoSources = makeMapVisualization({
        sources: {
            default_source: sourceDateRangesJson(sourceJson(12), [2014, 2015]),
            other_sources: [sourceDateRangesJson(sourceJson(13), [2015, 2016])],
        },
    })
    const source = (id: number) => {
        const found = twoSources.data?.sources[id]
        if (found === undefined) {
            throw new Error(`expected source ${id}`)
        }
        return found
    }

    test('keeps the date range when the new source has it', () => {
        const state = reducer(stateWithSelection(), changeDataSource(source(13)))
        expect(firstSelection(state)).toEqual({
            mapVisualization: mapVisualizationWithData.id,
            dataSource: 13,
            dateRange: isoInterval(2015, 2015),
        })
    })

    test("uses the new source's default date range when it lacks the current one", () => {
        let state = reducer(stateWithSelection(), changeDateRange(interval(2014, 2014)))
        state = reducer(state, changeDataSource(source(13)))
        expect(firstSelection(state)).toEqual({
            mapVisualization: mapVisualizationWithData.id,
            dataSource: 13,
            dateRange: isoInterval(2016, 2016),
        })
    })
})
