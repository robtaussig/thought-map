import { 
  thoughts as thoughtActions,
  connections as connectionActions,
  plans as planActions,
  notes as noteActions,
  tags as tagActions,
} from './';

export const createWholeThought = async ({
  title,
  type,
  date,
  time,
  description,
  notes,
  tags,
}) => {
  const createdThought = await thoughtActions.createThought({
    title, type, date, time, description,
  });
  const thoughtId = createdThought.id;
  const [createdNotes, createdTags] = await Promise.all([
    Promise.all(notes.map((note, idx) => noteActions.createNote({
      text: note,
      thoughtId,
      index: idx,
    }))),
    Promise.all(tags.map((tag, idx) => tagActions.createTag({
      text: tag,
      thoughtId,
      index: idx,
    })))
  ]);

  return {
    thought: createdThought, notes: createdNotes, tags: createdTags
  };
};
