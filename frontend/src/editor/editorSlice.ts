import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GeoMap } from '../appSlice'
import { mapApi, Tab } from '../MapApi'
import { MapVisualization, MapVisualizationId } from '../MapVisualization'
import { RootState } from '../store'

interface EditorState {
    readonly selectedTab?: Tab
    readonly selectedMapVisualizationByTab: Record<number, MapVisualizationId>
    readonly map?: GeoMap
}

const initialState: EditorState = { selectedMapVisualizationByTab: {} }

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setTab(state, { payload }: PayloadAction<Tab>) {
            state.selectedTab = payload
        },
        setMap(state, { payload }: PayloadAction<GeoMap>) {
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
                    const tab = Number(tabId)
                    // set the first map visualization as the selected one if there's not
                    // already one selected or the selection no longer exists
                    if (
                        state.selectedMapVisualizationByTab[tab] === undefined ||
                        !mapVisualizations[state.selectedMapVisualizationByTab[tab]]
                    ) {
                        state.selectedMapVisualizationByTab[tab] =
                            Object.values(mapVisualizations)[0].id
                    }
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
