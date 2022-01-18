import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Backup } from '../store/rxdb/schemas/backup';
import { Selector } from 'react-redux';
import { RootState } from './';

export type Backups = Backup[];
export const backupSelector: Selector<RootState, Backups> = state => state.backups;

const initialState: Backups = [];

const backups = createSlice({
    name: 'backups',
    initialState,
    reducers: {
        setBackups(state, action: PayloadAction<Backups>) {
            return action.payload;
        },
        insert(state, action: PayloadAction<Backup>) {
            state.push(action.payload);
        },
        remove(state, action: PayloadAction<string>) {
            return state.filter(({ id }) => id !== action.payload);
        },
        update(state, action: PayloadAction<Backup>) {
            return state.map(backup => backup.id === action.payload.id ? action.payload : backup);
        },
    }
});

export const {
    setBackups,
    insert,
    remove,
    update,
} = backups.actions;

export default backups.reducer;
