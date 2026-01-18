import { configureStore } from '@reduxjs/toolkit';
import contractReducer from './contractSlice';
import blueprintReducer from './blueprintSlice';

export const store = configureStore({
  reducer: {
    contracts: contractReducer,
    blueprints: blueprintReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
