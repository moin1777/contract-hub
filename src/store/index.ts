import { configureStore } from '@reduxjs/toolkit';
import contractReducer from './contractSlice';

export const store = configureStore({
  reducer: {
    contracts: contractReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
