import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { insert as insertStatus } from './statuses';
import { Selector } from 'react-redux';
import { RootState } from './';
import { bulkCreateThoughtsAndConnections } from './actions';

export const statusesByThoughtSelector: Selector<
  RootState,
  StatusesByThought
> = (state) => state.statusesByThought;
export interface StatusesByThought {
  [thoughtId: string]: string[];
}

const initialState: StatusesByThought = {};

const statusesByThought = createSlice({
  name: 'statusesByThought',
  initialState,
  reducers: {
    setStatusesByThought(_state, action: PayloadAction<StatusesByThought>) {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(insertStatus, (state, action) => {
      if ((window as any).batchingBulkThoughts) return state;
      state[action.payload.thoughtId] = state[action.payload.thoughtId] || [];
      state[action.payload.thoughtId].unshift(action.payload.id);
    });
    builder.addCase(bulkCreateThoughtsAndConnections, (state, action) => {
      action.payload.statuses.forEach(status => {
        state[status.thoughtId] = state[status.thoughtId] || [];
        state[status.thoughtId].push(status.id);
      });
      
      return state;
    });
  },
});

export const { setStatusesByThought } = statusesByThought.actions;

export default statusesByThought.reducer;
