import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Status } from '../store/rxdb/schemas/status';
import { Selector } from 'react-redux';
import { RootState } from './';

export const statusesByThoughtSelector: Selector<RootState, StatusesByThought> = state => state.statusesByThought;
export interface StatusesByThought {
  [thoughtId: string]: string[],
}

const initialState: StatusesByThought = {};

const statusesByThought = createSlice({
  name: 'statusesByThought',
  initialState,
  reducers: {
    setStatusesByThought(state, action: PayloadAction<StatusesByThought>) {
      return action.payload
    },
    insert(state, action: PayloadAction<Status>) {
      state[action.payload.thoughtId] = state[action.payload.thoughtId] || [];
      state[action.payload.thoughtId].push(action.payload.id);
    },
    remove(state, action: PayloadAction<Status>) {
      state[action.payload.thoughtId] = (state[action.payload.thoughtId] || []).filter(statusId => statusId !== action.payload.id);
    },
  }
});

export const {
  setStatusesByThought,
  insert,
  remove,
} = statusesByThought.actions;

export default statusesByThought.reducer;
