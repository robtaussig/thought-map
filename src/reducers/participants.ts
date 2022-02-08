import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Participant } from '../store/rxdb/schemas/participant';
import { RootState } from './';

const participantsAdapter = createEntityAdapter<Participant>({
  selectId: participant => participant.id,
  sortComparer: (a, b) => a.updated - b.updated,
});

const participants = createSlice({
  name: 'participants',
  initialState: participantsAdapter.getInitialState(),
  reducers: {
    setParticipants: participantsAdapter.setAll,
    insert: participantsAdapter.addOne,
    remove: participantsAdapter.removeOne,
    update: participantsAdapter.updateOne,
  },
});

export const participantSelector = participantsAdapter.getSelectors<RootState>(
  state => state.participants
);

export const { setParticipants, insert, remove, update } = participants.actions;

export default participants.reducer;
