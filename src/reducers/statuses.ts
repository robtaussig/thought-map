import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Status } from '../store/rxdb/schemas/status';
import { Selector } from 'react-redux';
import { RootState } from './';

export const statusSelector: Selector<RootState, Statuses> = state => state.statuses;
export interface Statuses {
  [statusId: string]: Status,
}

const initialState: Statuses = {};

const statuses = createSlice({
  name: 'statuses',
  initialState,
  reducers: {
    setStatuses(state, action: PayloadAction<Statuses>) {
      return action.payload
    },
    insert(state, action: PayloadAction<Status>) {
      state[action.payload.id] = action.payload;
    },
    remove(state, action: PayloadAction<Status>) {
      delete state[action.payload.id];
    },
    update(state, action: PayloadAction<Status>) {
      state[action.payload.id] = action.payload;
    },
  }
});

export const {
  setStatuses,
  insert,
  remove,
  update,
} = statuses.actions;

export default statuses.reducer;
