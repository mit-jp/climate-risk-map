import { Tab } from './MapApi'
import reducer, { changeDateRange, changeMapSelection, setMapSelections, setTab } from './appSlice'
import { interval, makeEmptyMapVisualization, makeMapVisualization } from './test-fixtures'

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
                dateRange: interval(2015, 2015),
            },
        ])
    )
    return state
}

const firstSelection = (state: ReturnType<typeof reducer>) =>
    state.mapSelections[state.region][tab.id][0]

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
            dateRange: interval(2015, 2015),
        })
    })

    test('creates a selection when there is none', () => {
        let state = reducer(undefined, setTab(tab))
        state = reducer(state, setMapSelections([]))
        state = reducer(state, changeMapSelection(mapVisualizationWithData))
        expect(firstSelection(state)).toEqual({
            mapVisualization: mapVisualizationWithData.id,
            dataSource: 12,
            dateRange: interval(2015, 2015),
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
