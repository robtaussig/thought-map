import { MutableRefObject } from 'react';
import { notes as noteActions, tags as tagActions, thoughts as thoughtActions } from '../../actions';
import { Thought } from 'store/rxdb/schemas/thought';
import { Tag } from 'store/rxdb/schemas/tag';
import { Note as NoteType } from 'store/rxdb/schemas/note';
import { RxDatabase } from 'rxdb';
import {
  EditedMap,
  EditedObject,
  SectionVisibility,
} from './types';

export const handleUpdates = async (
  db: RxDatabase,
  addedNotes: string[],
  addedTags: string[],
  edittedNotes: EditedMap,
  thought: Thought,
  tags: Tag[],
  notes: NoteType[],
  edittedTitle: string,
  edittedDescription: string,
  reset: () => void
) => {
  const notesToAdd: EditedObject[] = [];
  const tagsToAdd: EditedObject[] = [];
  const notesToEdit: EditedObject[] = [];
  const tagsToEdit: EditedObject[] = [];

  addedNotes.forEach(addedNote => {
    notesToAdd.push({
      text: addedNote,
      thoughtId: thought.id,
    });
  });

  addedTags.forEach(addedTag => {
    tagsToAdd.push({
      text: addedTag,
      thoughtId: thought.id,
    });
  });

  Object.keys(edittedNotes).forEach(id => {
    const foundNote = notes.find(note => note.id === id);
    const foundTag = tags.find(tag => tag.id === id);
    if (foundNote) {
      notesToEdit.push(Object.assign({}, foundNote, {
        text: edittedNotes[id],
      }));
    } else if (foundTag) {
      tagsToEdit.push(Object.assign({}, foundTag, {
        text: edittedNotes[id],
      }));
    }
  });

  if (edittedTitle !== thought.title || edittedDescription !== thought.description) {
    await thoughtActions.editThought(db, Object.assign({}, thought, {
      title: edittedTitle !== '' ? edittedTitle : thought.title,
      description: edittedDescription !== '' ? edittedDescription : thought.description,
    }));
  }

  await Promise.all([
    Promise.all(notesToAdd.map(note => noteActions.createNote(db, note))),
    Promise.all(tagsToAdd.map(tag => tagActions.createTag(db, tag))),
    Promise.all(notesToEdit.map(note => noteActions.editNote(db, note))),
    Promise.all(tagsToEdit.map(tag => tagActions.editTag(db, tag))),
  ]);
  reset();
};

export const getTime = (ms: number): string => {
  if (!ms) return null;

  const datetime = new Date(ms);

  return `${datetime.getMonth() + 1}/${datetime.getDate()}/${datetime.getFullYear()}`;
};

export const generateNextSectionsAfterMove = (
  sectionOrder: MutableRefObject<string[]>,
  sectionVisibility: MutableRefObject<SectionVisibility>,
  sectionToMove: string,
  sectionToMoveAbove: string,
): string => {

  return sectionOrder.current.reduce((next, section) => {
    if (section !== sectionToMove) {
      if (sectionToMoveAbove === section) {
        next.push(sectionToMove);        
      }
      next.push(section);
    }

    return next;
  }, [])
    .map((section => {
      if (sectionVisibility.current[section] === false) {
        return `_${section}`;
      }
      return section;
    }))
    .join('-');
};

export const generateNextSectionsAfterToggleVisibility = (
  sectionOrder: MutableRefObject<string[]>,
  sectionVisibility: MutableRefObject<SectionVisibility>,
  sectionType: string,
): string => {
  const canToggle = Object.values(sectionVisibility).filter(val => val === false).length + 2 <= sectionOrder.current.length;

  const res = sectionOrder.current.map(section => {
    let isVisible = sectionVisibility.current[section] !== false;
    if (sectionType === section && (!isVisible || canToggle)) {
      isVisible = !isVisible;
    }
    if (isVisible === false) return `_${section}`;
    return section;
  })
    .join('-');

  return res;
};
