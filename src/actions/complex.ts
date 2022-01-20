import { format } from 'date-fns';
import { RxDatabase } from 'rxdb';
import { Thought } from '../store/rxdb/schemas/thought';
import { 
  notes as noteActions,
  statuses as statusActions,
  tags as tagActions,
  thoughts as thoughtActions,
} from './';

interface WholeThought {
  title: string;
  type: string;
  date: string;
  time: string;
  description: string;
  notes: any[];
  tags: any[];
  staged?: boolean;
}

export const createWholeThought = async (db: RxDatabase, {
  title,
  type,
  date,
  time,
  description,
  notes,
  tags,
  staged,
}: WholeThought, planId: string | boolean) => {
  const thought: Thought = {
    title, type, date, time, description, priority: 5, sections: '',
  };
  if (staged) {
    const today = format(new Date(), 'yyyy-MM-dd');
    thought.stagedOn = today;
  }
  if (typeof planId === 'string') thought.planId = planId;

  const createdThought = await thoughtActions.createThought(db, thought);
  const thoughtId = createdThought.id;
  await statusActions.createStatus(db, {
    thoughtId,
    text: 'new',
  });
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
