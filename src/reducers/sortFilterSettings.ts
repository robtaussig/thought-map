import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Selector } from 'react-redux';
import { RootState } from './';

export const sortFilterSettingsSelector: Selector<RootState, SortFilterSettings> = state => state.sortFilterSettings;
export enum SortFilterField {
  Title = 'title',
  Status = 'status',
  Type = 'type',
}

export interface SortFilterSettings {
  field?: SortFilterField;
  desc?: boolean;
}

const initialState: SortFilterSettings = {};

const sortFilterSettings = createSlice({
    name: 'sortFilterSettings',
    initialState,
    reducers: {
        setSortFilterSettings(state, action: PayloadAction<SortFilterSettings>) {
            return action.payload;
        },
        sortBy(state, action: PayloadAction<SortFilterField>) {
            return {
                field: state.field === action.payload && state.desc === false ? null : action.payload,
                desc: state.field === action.payload ?
                    state.desc === false ? null : !state.desc :
                    true
            };
        },
    }
});

export const {
    setSortFilterSettings,
    sortBy,
} = sortFilterSettings.actions;

export default sortFilterSettings.reducer;
