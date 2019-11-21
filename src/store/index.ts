import { createContext } from 'react';
import { History } from 'history';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/';

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export default store;

interface AppContext {
  history?: History;
}

export const Context = createContext<AppContext>({});
