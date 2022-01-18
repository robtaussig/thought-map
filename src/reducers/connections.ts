import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Connection } from '../store/rxdb/schemas/connection';
import { Selector } from 'react-redux';
import { RootState } from './';

export const connectionSelector: Selector<RootState, Connections> = state => state.connections;
export interface Connections {
  [connectionId: string]: Connection;
}

const initialState: Connections = {};

const connections = createSlice({
    name: 'connections',
    initialState,
    reducers: {
        setConnections(state, action: PayloadAction<Connections>) {
            return action.payload;
        },
        insert(state, action: PayloadAction<Connection>) {
            state[action.payload.id] = action.payload;
        },
        remove(state, action: PayloadAction<string>) {
            delete state[action.payload];
        },
        update(state, action: PayloadAction<Connection>) {
            state[action.payload.id] = action.payload;
        },
    }
});

export const {
    setConnections,
    insert,
    remove,
    update,
} = connections.actions;

export default connections.reducer;
