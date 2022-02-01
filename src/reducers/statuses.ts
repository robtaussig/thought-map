import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Status } from '../store/rxdb/schemas/status';
import { Selector } from 'react-redux';
import { RootState } from './';
import { bulkCreateThoughtsAndConnections } from './actions';

export const statusSelector: Selector<RootState, Statuses> = (state) =>
  state.statuses;
export interface Statuses {
  [statusId: string]: Status;
}

const initialState: Statuses = {};

const statuses = createSlice({
  name: 'statuses',
  initialState,
  reducers: {
    setStatuses(_state, action: PayloadAction<Statuses>) {
      return action.payload;
    },
    insert(state, action: PayloadAction<Status>) {
      if ((window as any).batchingBulkThoughts) return state;
      state[action.payload.id] = action.payload;
    },
    remove(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
    update(state, action: PayloadAction<Status>) {
      state[action.payload.id] = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(bulkCreateThoughtsAndConnections, (state, action) => {
      action.payload.statuses.forEach(status => {
        state[status.id] = status;
      });
      
      return state;
    });
  }
});

export const { setStatuses, insert, remove, update } = statuses.actions;

export default statuses.reducer;
