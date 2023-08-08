import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GeoMap } from '../appSlice'
import { mapApi, Tab } from '../MapApi'
import { MapSpec, MapSpecId } from '../MapVisualization'
import { RootState } from '../store'

interface EditorState {
    readonly selectedTab?: Tab
    readonly selectedMapSpecByTab: Record<number, MapSpecId>
    readonly map?: GeoMap
}

const initialState: EditorState = { selectedMapSpecByTab: {} }

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setTab(state, { payload }: PayloadAction<Tab>) {
            state.selectedTab = payload
        },
        clickMapSpec(state, { payload }: PayloadAction<MapSpec>) {
            if (state.selectedTab) {
                state.selectedMapSpecByTab[state.selectedTab.id] = payload.id
            }
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(mapApi.endpoints.getTabs.matchFulfilled, (state, actions) => {
            const firstTab = actions.payload[0]
            state.selectedTab = firstTab
        })
        builder.addMatcher(mapApi.endpoints.getMapSpecs.matchFulfilled, (state, actions) => {
            Object.entries(actions.payload).forEach(([tabId, mapSpec]) => {
                const tab = Number(tabId)
                // set the first map spec as the selected one if there's not
                // already one selected or the selection no longer exists
                if (
                    state.selectedMapSpecByTab[tab] === undefined ||
                    !mapSpec[state.selectedMapSpecByTab[tab]]
                ) {
                    state.selectedMapSpecByTab[tab] = Object.values(mapSpec)[0].id
                }
            })
        })
    },
})

export const { setTab, clickMapSpec } = editorSlice.actions

export const selectSelectedTabAndMapSpec = (state: RootState) => {
    const { selectedTab } = state.editor
    const selectedMapSpecId =
        selectedTab !== undefined ? state.editor.selectedMapSpecByTab[selectedTab.id] : undefined
    return {
        selectedTab,
        selectedMapSpecId,
    }
}

export default editorSlice.reducer
