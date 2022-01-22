import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Connection } from '../store/rxdb/schemas/connection';
import { Selector } from 'react-redux';
import { RootState } from './';
import { bulkCreateThoughtsAndConnections } from './actions';

export const connectionSelector: Selector<RootState, Connections> = (state) =>
  state.connections;
export interface Connections {
  [connectionId: string]: Connection;
}

const initialState: Connections = {};

const connections = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    setConnections(_state, action: PayloadAction<Connections>) {
      return action.payload;
    },
    insert(state, action: PayloadAction<Connection>) {
      if ((window as any).batchingBulkThoughts) return state;
      state[action.payload.id] = action.payload;
    },
    remove(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
    update(state, action: PayloadAction<Connection>) {
      if ((window as any).batchingBulkThoughts) return state;
      state[action.payload.id] = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(bulkCreateThoughtsAndConnections, (state, action) => {
      action.payload.connections.forEach(connection => {
        state[connection.id] = connection;
      });
    });
  },
});

export const { setConnections, insert, remove, update } = connections.actions;

export default connections.reducer;
