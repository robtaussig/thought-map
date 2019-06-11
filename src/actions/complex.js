import { 
  thoughts as thoughtActions,
  connections as connectionActions,
  plans as planActions,
  notes as noteActions,
  tags as tagActions,
} from './';

export const createWholeThought = async (db, {
  title,
  type,
  date,
  time,
  description,
  notes,
  tags,
}) => {
  const createdThought = await thoughtActions.createThought(db, {
    title, type, date, time, description, status: 'new',
  });
  const thoughtId = createdThought.id;
  const [createdNotes, createdTags] = await Promise.all([
    Promise.all(notes.map((note, idx) => noteActions.createNote(db, {
      text: note,
      thoughtId,
      index: idx,
    }))),
    Promise.all(tags.map((tag, idx) => tagActions.createTag(db, {
      text: tag,
      thoughtId,
      index: idx,
    })))
  ]);

  return {
    thought: createdThought, notes: createdNotes, tags: createdTags
  };
};
