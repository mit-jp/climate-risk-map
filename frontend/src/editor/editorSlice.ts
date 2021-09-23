import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import DataTab from "../DataTab";
import { defaultMapVisualizations, MapVisualizationByTab } from "../MapVisualization";
import { RootState } from "../store";

interface EditorState {
    readonly mapVisualizations: MapVisualizationByTab,
    readonly selectedTab: DataTab,
};

const initialState: EditorState = {
    mapVisualizations: defaultMapVisualizations,
    selectedTab: DataTab.RiskMetrics,
}

export const editorSlice = createSlice({
    name: 'editor',
    initialState: initialState,
    reducers: {
        setMapVisualizations: (state, { payload }: PayloadAction<MapVisualizationByTab>) => {
            state.mapVisualizations = payload;
        },
        clickTab(state, { payload }: PayloadAction<DataTab>) {
            state.selectedTab = payload;
        }
    },
});

export const {
    setMapVisualizations,
    clickTab,
} = editorSlice.actions;

export const selectMapVisualizationsForTab = createSelector(
    (state: RootState) => state.editor.mapVisualizations,
    (state: RootState) => state.editor.selectedTab,
    (mapVisualizations, selectedTab) => Object.values(mapVisualizations[selectedTab])
);

export const selectTabs = createSelector(
    (state: RootState) => state.editor.mapVisualizations,
    (mapVisualizations) => Object.keys(mapVisualizations) as DataTab[]
)

export default editorSlice.reducer;