import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { mapApi, Tab } from '../MapApi'
import { MapVisualization, MapVisualizationId } from '../MapVisualization'
import { RootState } from '../store'
import { TopoJson } from '../TopoJson'

interface EditorState {
    readonly selectedTab?: Tab
    readonly selectedMapVisualizationByTab: Record<number, MapVisualizationId>
    readonly map?: TopoJson
}

const initialState: EditorState = { selectedMapVisualizationByTab: {} }

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setTab(state, { payload }: PayloadAction<Tab>) {
            state.selectedTab = payload
        },
        setMap(state, { payload }: PayloadAction<TopoJson>) {
            state.map = payload
        },
        clickMapVisualization(state, { payload }: PayloadAction<MapVisualization>) {
            if (state.selectedTab) {
                state.selectedMapVisualizationByTab[state.selectedTab.id] = payload.id
            }
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(mapApi.endpoints.getTabs.matchFulfilled, (state, actions) => {
            const firstTab = actions.payload[0]
            state.selectedTab = firstTab
        })
        builder.addMatcher(
            mapApi.endpoints.getMapVisualizations.matchFulfilled,
            (state, actions) => {
                Object.entries(actions.payload).forEach(([tabId, mapVisualizations]) => {
                    state.selectedMapVisualizationByTab[Number(tabId)] =
                        Object.values(mapVisualizations)[0].id
                })
            }
        )
    },
})

export const { setTab, setMap, clickMapVisualization } = editorSlice.actions

export const selectSelectedTabAndMapVisualization = (state: RootState) => {
    const { selectedTab } = state.editor
    const selectedMapVisualizationId =
        selectedTab !== undefined
            ? state.editor.selectedMapVisualizationByTab[selectedTab.id]
            : undefined
    return {
        selectedTab,
        selectedMapVisualizationId,
    }
}

export default editorSlice.reducer
