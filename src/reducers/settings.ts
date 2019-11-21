import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Setting } from '../store/rxdb/schemas/setting';
import { Selector } from 'react-redux';
import { RootState } from './';

export const settingSelector: Selector<RootState, Settings> = state => state.settings;
export interface Settings {
  [field: string]: Setting;
}

const initialState: Settings = {};

const settings = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings(state, action: PayloadAction<Settings>) {
      return action.payload;
    },
    insert(state, action: PayloadAction<Setting>) {
      state[action.payload.field] = action.payload.value;
    },
    remove(state, action: PayloadAction<Setting>) {
      delete state[action.payload.field];
    },
    update(state, action: PayloadAction<Setting>) {
      state[action.payload.field] = action.payload.value;
    },
  }
});

export const {
  setSettings,
  insert,
  remove,
  update,
} = settings.actions;

export default settings.reducer;
