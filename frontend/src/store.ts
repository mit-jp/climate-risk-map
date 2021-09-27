import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import editorReducer from './editor/editorSlice';
import { mapApi } from './MapApi';

export const store = configureStore({
  reducer: {
    app: appReducer,
    editor: editorReducer,
    [mapApi.reducerPath]: mapApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(mapApi.middleware),
  devTools: {
    stateSanitizer: (state: any) => {
      return {
        ...state,
        app: {
          ...state.app,
          data: state.app.data ? "<Large data not displayed to save memory>" : undefined,
          map: state.app.map ? "<Large map not displayed to save memory>" : undefined,
          overlays: "<Large data not displayed to save memory>",
        },
        editor: {
          ...state.editor,
          map: state.editor.map ? "<Large map not displayed to save memory>" : undefined,
        }
      };
    },
    actionsBlacklist: ['app/hoverCounty', 'app/hoverPosition'],
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
