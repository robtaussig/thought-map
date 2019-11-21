import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Template } from '../store/rxdb/schemas/template';
import { Selector } from 'react-redux';
import { RootState } from './';

export const templateSelector: Selector<RootState, Templates> = state => state.templates;
export type Templates = Template[];

const initialState: Templates = [];

const templates = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setTemplates(state, action: PayloadAction<Templates>) {
      state = action.payload
    },
    insert(state, action: PayloadAction<Template>) {
      return state.concat(action.payload);
    },
    remove(state, action: PayloadAction<Template>) {
      return state.filter(template => template.id !== action.payload.id);
    },
    update(state, action: PayloadAction<Template>) {
      return state.map(template => template.id == action.payload.id ? action.payload : template);
    },
  }
});

export const {
  setTemplates,
  insert,
  remove,
  update,
} = templates.actions;

export default templates.reducer;
