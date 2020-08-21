import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BulkList } from '../store/rxdb/schemas/bulkList';
import { Selector } from 'react-redux';
import { RootState } from './';

export const bulkListSelector: Selector<RootState, BulkLists> = state => state.bulkLists;
export type BulkLists = BulkList[];

const initialState: BulkLists = [];

const bulkLists = createSlice({
  name: 'bulkLists',
  initialState,
  reducers: {
    setBulkLists(state, action: PayloadAction<BulkLists>) {
      return action.payload
    },
    insert(state, action: PayloadAction<BulkList>) {
      return state.concat(action.payload);
    },
    remove(state, action: PayloadAction<BulkList>) {
      return state.filter(bulkList => bulkList.id !== action.payload.id);
    },
    update(state, action: PayloadAction<BulkList>) {
      return state.map(bulkList => bulkList.id == action.payload.id ? action.payload : bulkList);
    },
  }
});

export const {
  setBulkLists,
  insert,
  remove,
  update,
} = bulkLists.actions;

export default bulkLists.reducer;
