import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Plan } from '../store/rxdb/schemas/plan';
import { Selector } from 'react-redux';
import { RootState } from './';

export const planSelector: Selector<RootState, Plans> = state => state.plans;
export type Plans = Plan[];

const initialState: Plans = [];

const plans = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    setPlans(state, action: PayloadAction<Plans>) {
      return action.payload.concat({ id: 'archive', name: 'Thought Archive'});
    },
    insert(state, action: PayloadAction<Plan>) {
      return state.concat(action.payload);
    },
    remove(state, action: PayloadAction<Plan>) {
      return state.filter(plan => plan.id !== action.payload.id);
    },
    update(state, action: PayloadAction<Plan>) {
      return state.map(plan => plan.id == action.payload.id ? action.payload : plan);
    },
  }
});

export const {
  setPlans,
  insert,
  remove,
  update,
} = plans.actions;

export default plans.reducer;
