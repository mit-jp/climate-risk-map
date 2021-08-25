import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from './appSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: {
    stateSanitizer: (state: any) => {
      return {
        ...state,
        app: {
          ...state.app,
          data: state.app.data ? "<Large data not displayed to save memory>" : undefined,
          map: state.app.map ? "<Large map not displayed to save memory>" : undefined,
          overlays: "<Large data not displayed to save memory>",
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
