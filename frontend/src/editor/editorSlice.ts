import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Tab } from '../MapApi'
import { MapVisualization, MapVisualizationId } from '../MapVisualization'
import { RootState } from '../store'
import { TopoJson } from '../TopoJson'

interface EditorState {
    readonly selectedTabId?: number
    readonly tabs: Tab[]
    readonly selectedMapVisualizationByTab: { [key: number]: MapVisualizationId }
    readonly map?: TopoJson
}

const initialState: EditorState = {
    tabs: [],
    selectedTabId: 8, // risk metrics
    selectedMapVisualizationByTab: {
        8: 71,
        1: 1,
        2: 15,
        3: 22,
        4: 12,
        7: 28,
        6: 35,
        5: 64,
        9: 71,
    },
}

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
