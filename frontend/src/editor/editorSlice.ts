import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import DataTab from '../DataTab'
import { Tab } from '../MapApi'
import { MapVisualization, MapVisualizationId } from '../MapVisualization'
import { RootState } from '../store'
import { TopoJson } from '../TopoJson'

interface EditorState {
    readonly selectedTabId?: DataTab
    readonly tabs: Tab[]
    readonly selectedMapVisualizationByTab: { [key in DataTab]: MapVisualizationId }
    readonly map?: TopoJson
}

const initialState: EditorState = {
    tabs: [],
    selectedTabId: DataTab.RiskMetrics,
    selectedMapVisualizationByTab: {
        [DataTab.RiskMetrics]: 71,
        [DataTab.Water]: 1,
        [DataTab.Land]: 15,
        [DataTab.Climate]: 22,
        [DataTab.Economy]: 12,
        [DataTab.Demographics]: 28,
        [DataTab.ClimateOpinions]: 35,
        [DataTab.Energy]: 64,
        [DataTab.Health]: 71,
    },
}

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setTab(state, { payload }: PayloadAction<DataTab>) {
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
