import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Status } from '../store/rxdb/schemas/status';
import { insert as insertStatus } from './statuses';
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
  },
  extraReducers: builder => {
    builder.addCase(insertStatus, (state, action) => {
      state[action.payload.thoughtId] = state[action.payload.thoughtId] || [];
      state[action.payload.thoughtId].push(action.payload.id);
    });
  },
});

export const {
  setStatusesByThought,
} = statusesByThought.actions;

export default statusesByThought.reducer;
