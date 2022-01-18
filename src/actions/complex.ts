import { RxDatabase } from 'rxdb';
import { Thought } from '../store/rxdb/schemas/thought';
import { 
    thoughts as thoughtActions,
    connections as connectionActions,
    plans as planActions,
    notes as noteActions,
    tags as tagActions,
    statuses as statusActions,
} from './';

interface WholeThought {
  title: string;
  type: string;
  date: string;
  time: string;
  description: string;
  notes: any[];
  tags: any[];
}

export const createWholeThought = async (db: RxDatabase, {
    title,
    type,
    date,
    time,
    description,
    notes,
    tags,
}: WholeThought, planId: string | boolean) => {
    const thought: Thought = {
        title, type, date, time, description, priority: 5, sections: '',
    };
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
