import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Thought } from '../store/rxdb/schemas/thought';
import { RootState } from './';
import { bulkCreateThoughtsAndConnections } from './actions';

export type Thoughts = Thought[];

const sortThoughtsByLastUpdated = (
  { updated: leftUpdated }: Thought,
  { updated: rightUpdated }: Thought
) => {
  return rightUpdated - leftUpdated;
};

const thoughtsAdapter = createEntityAdapter<Thought>({
  selectId: thought => thought.id,
  sortComparer: sortThoughtsByLastUpdated
});

const thoughts = createSlice({
  name: 'thoughts',
  initialState: thoughtsAdapter.getInitialState(),
  reducers: {
    setThoughts: thoughtsAdapter.setAll,
    insert: thoughtsAdapter.addOne,
    remove: thoughtsAdapter.removeOne,
    update: thoughtsAdapter.updateOne,
  },
  extraReducers: builder => {
    builder.addCase(bulkCreateThoughtsAndConnections, (state, action) => {
      const newThoughts = action.payload.thoughts.map(thought => ({
        ...thought,
        status: action.payload.statuses.find(({ thoughtId }) => thoughtId === thought.id).text,
      }));

      return thoughtsAdapter.addMany(state, newThoughts);
    });
  }
});

export const thoughtSelector = thoughtsAdapter.getSelectors<RootState>(
  state => state.thoughts
);

export const { setThoughts, insert, remove, update } = thoughts.actions;

export default thoughts.reducer;
