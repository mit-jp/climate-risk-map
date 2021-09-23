import { createSlice } from "@reduxjs/toolkit";
import { MapVisualization } from "./MapVisualization";

interface EditorState {
    mapVisualizations: MapVisualization[],
};

const initialState: EditorState = {
    mapVisualizations: [],
}

export const editorSlice = createSlice({
    name: 'editor',
    initialState: initialState,
    reducers: {

    },
});

export const {

} = editorSlice.actions;

export default editorSlice.reducer;