import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Selector } from 'react-redux';
import { RootState } from './';

export const displayPrioritiesSelector: Selector<RootState, boolean> = state => state.displayPriorities;

const initialState = true;

const displayPriorities = createSlice({
  name: 'displayPriorities',
  initialState,
  reducers: {
    toggle(state, action: PayloadAction<boolean>) {
      if (action.payload !== undefined) {
        return action.payload;
      }
      return !state;
    },
  }
});

export const {
  toggle
} = displayPriorities.actions;

export default displayPriorities.reducer;
