import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Selector } from 'react-redux';
import { MergeResults, Item, Comparable } from '../components/Merge/types';
import { RootState } from './';

export const mergeResultsSelector: Selector<RootState, MergeResults> = state => state.mergeResults;

const initialState: MergeResults = {
  itemsToAdd: [],
  comparables: [],
  removables: {
    left: [],
    right: [],
  },
};

const mergeResults = createSlice({
  name: 'mergeResults',
  initialState,
  reducers: {
    setMergeResults(state, action: PayloadAction<MergeResults>) {
      return action.payload
    },
    removeItem(state, action: PayloadAction<number>) {
      return {
        ...state,
        itemsToAdd: state.itemsToAdd.filter((item, idx) => idx !== action.payload)
      };
    },
    addItem(state, action: PayloadAction<Item>) {
      state.itemsToAdd.push(action.payload);
    },
    resolveComparable(state, action: PayloadAction<{ comparableIndex: number, item: Item }>) {
      state.itemsToAdd.push(action.payload.item);
      state.comparables.splice(action.payload.comparableIndex, 1);
    },
  }
});

export const {
  setMergeResults,
  addItem,
  removeItem,
  resolveComparable,
} = mergeResults.actions;

export default mergeResults.reducer;
