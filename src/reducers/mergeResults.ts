import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Selector } from 'react-redux';
import { MergeResults, Item, Comparable, Removable } from '../components/Merge/types';
import { RootState } from './';

export const mergeResultsSelector: Selector<RootState, MergeResults> = state => state.mergeResults;

const initialState: MergeResults = {
  itemsToAdd: [],
  deletionsToAdd: [],
  itemsToRemove: [],
  comparables: [],
  removables:[],
};

const mergeResults = createSlice({
  name: 'mergeResults',
  initialState,
  reducers: {
    setMergeResults(state, action: PayloadAction<MergeResults>) {
      return action.payload;
    },
    removeItem(state, action: PayloadAction<number>) {
      const item = state.itemsToAdd[action.payload];
      state.itemsToAdd.splice(action.payload, 1);
      state.deletionsToAdd.push({
        collectionName: item.collectionName,
        itemId: item.item.id,
      });
    },
    addItem(state, action: PayloadAction<Item>) {
      state.itemsToAdd.push(action.payload);
    },
    resolveComparable(state, action: PayloadAction<{ comparableIndex: number, item: Item }>) {
      state.itemsToAdd.push(action.payload.item);
      state.comparables.splice(action.payload.comparableIndex, 1);
    },
    acceptDeletion(state, action: PayloadAction<number>) {
      const removable = state.removables[action.payload];
      state.deletionsToAdd.push(removable[0]);
      state.itemsToRemove.push({
        collectionName: removable[0].collectionName,
        item: removable[1],
      });
      state.removables.splice(action.payload, 1);
    },
    rejectDeletion(state, action: PayloadAction<number>) {
      const removable = state.removables[action.payload];
      state.deletionsToAdd.push(removable[0]);
      state.removables.splice(action.payload, 1);
    },
  }
});

export const {
  setMergeResults,
  addItem,
  removeItem,
  resolveComparable,
  acceptDeletion,
  rejectDeletion,
} = mergeResults.actions;

export default mergeResults.reducer;
