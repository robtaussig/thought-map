import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Thought } from '../store/rxdb/schemas/thought';
import { Selector } from 'react-redux';
import { RootState } from './';
import { insert as insertThought, update as updateThought, setThoughts, Thoughts } from './thoughts';
import { format } from 'date-fns';

export const stageSelector: Selector<RootState, Stage> = state => state.stage;
export interface Stage {
  current: string[];
  backlog: string[];
  origin: string;
}

const initialState: Stage = {
  current: [],
  backlog: [],
  origin: format(new Date(), 'yyyy-MM-dd'),
};

const stage = createSlice({
  name: 'stage',
  initialState,
  reducers: {
    refresh(state) {
      const today = format(new Date(), 'yyyy-MM-dd');
      if (today !== state.origin) {
        state.origin = today;
        state.backlog = state.current;
        state.current = [];
      }
    },
  },
  extraReducers: {
    [insertThought as any]: (state, action: PayloadAction<Thought>) => {
      if (action.payload.stagedOn) {
        const today = format(new Date(), 'yyyy-MM-dd');
        if (action.payload.stagedOn === today) {
          state.current.push(action.payload.id);
        } else {
          state.backlog.push(action.payload.id);
        }
      }
    },
    [updateThought as any]: (state, action: PayloadAction<Thought>) => {
      const isCurrent = state.current.includes(action.payload.id);
      const isBacklog = state.backlog.includes(action.payload.id);

      if (action.payload.stagedOn) {
        const today = format(new Date(), 'yyyy-MM-dd');
        if (action.payload.stagedOn === today) {
          if (!isCurrent) {
            state.current.push(action.payload.id);
          }
          if (isBacklog) {
            state.backlog = state.backlog.filter(prev => prev !== action.payload.id);
          }
        } else {
          if (!isBacklog) {
            state.backlog.push(action.payload.id);
          }
          if (isCurrent) {
            state.current = state.current.filter(prev => prev !== action.payload.id);
          }
        }
      } else {
        if (isCurrent) state.current = state.current.filter(prev => prev !== action.payload.id);
        if (isBacklog) state.backlog = state.backlog.filter(prev => prev !== action.payload.id);
      }
    },
    [setThoughts as any]: (state, action: PayloadAction<Thoughts>) => {
      state.current = [];
      state.backlog = [];
      const today = format(new Date(), 'yyyy-MM-dd');
      
      action.payload.forEach(thought => {
        if (thought.stagedOn) {
          if (thought.stagedOn === today) {
            state.current.push(thought.id);
          } else {
            state.backlog.push(thought.id);
          }
        }
      });
    },
  },
});

export const {
  refresh
} = stage.actions;

export default stage.reducer;
