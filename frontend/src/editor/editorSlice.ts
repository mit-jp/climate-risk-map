import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { mapApi } from '../MapApi'
import { MapVisualization, MapVisualizationId } from '../MapVisualization'
import { RootState } from '../store'
import { TopoJson } from '../TopoJson'

interface EditorState {
    readonly selectedTabId?: number
    readonly selectedMapVisualizationByTab: Record<number, MapVisualizationId>
    readonly map?: TopoJson
}

const initialState: EditorState = { selectedMapVisualizationByTab: {} }

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setTab(state, { payload }: PayloadAction<number>) {
            state.selectedTabId = payload
        },
        setMap(state, { payload }: PayloadAction<TopoJson>) {
            state.map = payload
        },
        clickMapVisualization(state, { payload }: PayloadAction<MapVisualization>) {
            if (state.selectedTabId) {
                state.selectedMapVisualizationByTab[state.selectedTabId] = payload.id
            }
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(mapApi.endpoints.getTabs.matchFulfilled, (state, actions) => {
            const tabIdString = Object.keys(actions.payload)[0]
            state.selectedTabId = tabIdString ? Number(tabIdString) : undefined
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
    const { selectedTabId } = state.editor
    const selectedMapVisualizationId =
        selectedTabId !== undefined
            ? state.editor.selectedMapVisualizationByTab[selectedTabId]
            : undefined
    return {
        selectedTabId,
        selectedMapVisualizationId,
    }
}

export default editorSlice.reducer
