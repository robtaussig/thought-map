import { createSlice } from '@reduxjs/toolkit';
import { Selector } from 'react-redux';
import { RootState } from './';
import { insert as insertThought, remove as removeThought, setThoughts, update as updateThought } from './thoughts';
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
  extraReducers: builder => {
    builder.addCase(insertThought, (state, action) => {
      if (action.payload.stagedOn) {
        const today = format(new Date(), 'yyyy-MM-dd');
        if (action.payload.stagedOn === today) {
          state.current.push(action.payload.id);
        } else {
          state.backlog.push(action.payload.id);
        }
      }
    });
    builder.addCase(updateThought, (state, action) => {
      const isCurrent = state.current.includes(action.payload.changes.id);
      const isBacklog = state.backlog.includes(action.payload.changes.id);

      if (action.payload.changes.status !== 'completed' && action.payload.changes.stagedOn) {
        const today = format(new Date(), 'yyyy-MM-dd');
        if (action.payload.changes.stagedOn === today) {
          if (!isCurrent) {
            state.current.push(action.payload.changes.id);
          }
          if (isBacklog) {
            state.backlog = state.backlog.filter(prev => prev !== action.payload.changes.id);
          }
        } else {
          if (!isBacklog) {
            state.backlog.push(action.payload.changes.id);
          }
          if (isCurrent) {
            state.current = state.current.filter(prev => prev !== action.payload.changes.id);
          }
        }
      } else {
        if (isCurrent) state.current = state.current.filter(prev => prev !== action.payload.changes.id);
        if (isBacklog) state.backlog = state.backlog.filter(prev => prev !== action.payload.changes.id);
      }
    });
    builder.addCase(setThoughts, (state, action) => {
      state.current = [];
      state.backlog = [];
      const today = format(new Date(), 'yyyy-MM-dd');
      if (Array.isArray(action.payload)) {
        action.payload.forEach(thought => {
          if (thought.status !== 'completed' && thought.stagedOn) {
            if (thought.stagedOn === today) {
              state.current.push(thought.id);
            } else {
              state.backlog.push(thought.id);
            }
          }
        });
      }
      
    });
    builder.addCase(removeThought, (state, action) => {
      const isCurrent = state.current.includes(String(action.payload));
      const isBacklog = state.backlog.includes(String(action.payload));
      if (isCurrent) state.current = state.current.filter(prev => prev !== String(action.payload));
      if (isBacklog) state.backlog = state.backlog.filter(prev => prev !== String(action.payload));
    });
  },
});

export const {
  refresh
} = stage.actions;

export default stage.reducer;
