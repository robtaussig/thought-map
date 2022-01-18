import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Selector } from 'react-redux';
import { RootState } from './';

export const displayThoughtSettingsSelector: Selector<RootState, boolean> = state => state.displayThoughtSettings;

const initialState = false;

const displayThoughtSettings = createSlice({
    name: 'displayThoughtSettings',
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
} = displayThoughtSettings.actions;

export default displayThoughtSettings.reducer;
