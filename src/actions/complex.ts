import { RxDatabase, RxJsonSchema, RxCollectionCreator } from 'rxdb';
import { Thought } from '../store/rxdb/schemas/thought';
import { 
  thoughts as thoughtActions,
  connections as connectionActions,
  plans as planActions,
  notes as noteActions,
  tags as tagActions,
} from './';

interface WholeThought {
  title: string,
  type: string,
  date: string,
  time: string,
  description: string,
  notes: any[],
  tags: any[],
}

export const createWholeThought = async (db: RxDatabase, {
  title,
  type,
  date,
  time,
  description,
  notes,
  tags,
}:WholeThought, planId: string | boolean) => {
  const thought: Thought = {
    title, type, date, time, description, status: 'new', priority: 5,
  };
  if (typeof planId === 'string') thought.planId = planId;

  const createdThought = await thoughtActions.createThought(db, thought);
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
