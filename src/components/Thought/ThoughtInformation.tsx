import React, { useCallback, useState, useMemo, useEffect, useRef, Fragment, FC } from 'react';
import Note from '@material-ui/icons/Note';
import AccessTime from '@material-ui/icons/AccessTime';
import CalendarToday from '@material-ui/icons/CalendarToday';
import Header from '../General/Header';
import Select from '../General/Select';
import Input from '../General/Input';
import Date from '../General/Date';
import CircleButton from '../General/CircleButton';
import Edit from '@material-ui/icons/Edit';
import Check from '@material-ui/icons/Check';
import Delete from '@material-ui/icons/Delete';
import { openConfirmation } from '../../lib/util';
import { notes as noteActions, thoughts as thoughtActions, tags as tagActions } from '../../actions';
import { useLoadedDB } from '../../hooks/useDB';
import useAutoSuggest from 'react-use-autosuggest';
import { Thought } from 'store/rxdb/schemas/thought';
import { Tag } from 'store/rxdb/schemas/tag';
import { Note as NoteType } from 'store/rxdb/schemas/note';
import { PriorityOption } from './'
import { RxDatabase } from 'rxdb';

interface ThoughtInformationProps {
  classes: any,
  thought: Thought,
  tags: Tag[],
  notes: NoteType[],
  statusOptions: string[],
  typeOptions: string[],
  tagOptions: string[],
  priorityOptions: PriorityOption[],
  onUpdate: (thought: Thought) => void,
  editState: boolean,
  onEditState: (edit: boolean) => void,
  stateNotes: NoteType[],
}

interface EditedMap {
  [id: string]: string
}

interface EditedObject {
  thoughtId: string,
  text: string,
}

interface ChangeValue {
  value: any,
}

interface ChangeType {
  target: ChangeValue,
}

export const ThoughtInformation: FC<ThoughtInformationProps> = React.memo(({
  classes,
  thought,
  tags = [],
  notes = [],
  statusOptions = [],
  typeOptions = [],
  tagOptions = [],
  priorityOptions = [],
  onUpdate,
  editState,
  onEditState,
  stateNotes,
}) => {
  const [edittingTime, setEdittingTime] = useState<boolean>(false);
  const [edittingDate, setEdittingDate] = useState<boolean>(false);
  const [edittedNotes, setEdittedNotes] = useState<EditedMap>({});
  const [edittedTitle, setEdittedTitle] = useState<string>(thought.title);
  const [addedNotes, setAddedNotes] = useState<string[]>([]);
  const [addedTags, setAddedTags] = useState<string[]>([]);
  const lastNoteRef = useRef<HTMLInputElement>(null);
  const db = useLoadedDB();
  const [lastNote, setLastNote] = useState<[number, string, boolean?]>([null, '']);
  const autoSuggestNotes = useMemo(() => {
    return Object.values(stateNotes).map(({ text }) => text);
  }, [stateNotes]);
  const noteSuggestions = useAutoSuggest(lastNote[1].trim(), autoSuggestNotes, 4);
  const handleStatusChange = useCallback(event => {
    onUpdate({ ...thought, status: event.target.value });
  }, [thought]);

  const handlePriorityChange = useCallback(event => {
    const value = priorityOptions.find(({ label }) => label === event.target.value).value;
    onUpdate({ ...thought, priority: value });
  }, [thought]);

  const handleSetTime = useCallback(event => {
    setEdittingTime(false);
    onUpdate({ ...thought, time: event.target.value })
  }, [thought]);

  const handleSetDate = useCallback(event => {
    setEdittingDate(false);
    onUpdate({ ...thought, date: event.target.value })
  }, [thought]);

  const handleClickEdit = useCallback(() => {
    onEditState(true);
  }, []);

  const reset = useCallback(() => {
    setEdittingTime(false);
    setEdittingDate(false);
    setEdittedNotes({});
    setAddedNotes([]);
    setAddedTags([]);
    setEdittedTitle(thought.title);
    setLastNote([null, '']);
  }, [thought]);

  const handleClickCancelEdit = () => {
    handleUpdates(db, addedNotes, addedTags.filter(tag => tag !== 'Select'), edittedNotes, thought, tags, notes, edittedTitle, reset);
    onEditState(false);
  };
  
  const handleTypeChange = useCallback(event => {
    onUpdate({ ...thought, type: event.target.value })
  }, [thought]);

  const handleInput = useCallback((id: any) => {
    return (e: ChangeType, isNew: boolean = false) => {      
      const value = e.target.value;
      if (isNew) {
        setLastNote([id, value, true]);
        setAddedNotes(prev => prev.map((prevNote, prevIdx) => {
          if (prevIdx === id) {
            return value;
          }
          return prevNote;
        }));
      } else {
        setLastNote([id, value]);
        setEdittedNotes(prev => ({
          ...prev,
          [id]: value,
        }));
      }
    };
  }, []);

  const handleDelete = useCallback((id: string, type: string): () => void => {
    return () => {
      const onConfirm = type === 'note' ?
        () => noteActions.deleteNote(db, id) :
        type === 'tag' ?
        () => tagActions.deleteTag(db, id) :
        () => {};

      openConfirmation('Are you sure?', onConfirm);
    };
  }, []);

  useEffect(reset,[thought]);

  const _autoSuggestComponent = useMemo(() => {

    const handleClickSuggestion = (suggestionValue: string) => {
      if (suggestionValue.startsWith(' ')) {
        handleInput(lastNote[0])({
          target: {
            value: `${lastNote[1].trim()}${suggestionValue} `
          }
        }, lastNote[2])
      } else {
        handleInput(lastNote[0])({
          target: {
            value: lastNote[1].split(' ').map((word, idx) => {
              if (idx === lastNote[1].split(' ').length - 1) {
                return suggestionValue;
              } else {
                return word;
              }
            }).join(' ') + ' '
          }
        }, lastNote[2])
      }
      if (lastNoteRef.current && lastNoteRef.current.focus) lastNoteRef.current.focus();
    };

    if (noteSuggestions && noteSuggestions.length > 0) {
      return (
        <ul style={{
          position: 'fixed',
          display: 'flex',
          bottom: '110px',
          left: '0px',
          right: '0px',
          height: '80px',
          backgroundColor: 'black',
          alignItems: 'center',
          justifyContent: 'space-around',
          opacity: 0.7,
          overflow: 'auto',
        }}>
          {noteSuggestions.map((suggestion, idx) => {
            return (
              <li
                key={`${suggestion}-${idx}`}
                style={{
                  margin: '0 15px',
                }}
              >
                <button
                  style={{
                    color: 'white',
                  }}
                  onClick={() => {
                    handleClickSuggestion(suggestion);
                  }}
                >
                  {suggestion.replace(' ', '...')}
                </button>
              </li>
            )
          })}
        </ul>
      );
    }
    return null;
  }, [noteSuggestions, lastNote]);

  const noteList = useMemo(() => {
    return (
      <ul className={classes.noteList}>
          {notes
            .sort((a, b) => a.created - b.created)
            .map(({ text, id }, idx) => {
            return editState ? (
              <li className={classes.noteItem} key={`${idx}-note`}>
                <button className={classes.deleteIcon} onClick={handleDelete(id, 'note')}><Delete/></button>
                <input className={classes.noteEditInput} onChange={e => {
                  handleInput(id)(e);
                  lastNoteRef.current = e.target;
                }} value={edittedNotes[id] || text}/>
              </li>
            ) : (
              <li className={classes.noteItem} key={`${idx}-note`}><Note className={classes.noteIcon}/>{text}</li>
            );
          }).concat(addedNotes.map((addedNote, idx) => {
            return (
              <li className={classes.noteItem} key={`${idx}-added-note`}>
                <button className={classes.deleteIcon} onClick={() => setAddedNotes(prev => prev.filter((_, prevIdx) => prevIdx !== idx))}><Delete/></button>
                <input className={classes.noteEditInput} onChange={e => {
                  handleInput(idx)(e, true);
                  lastNoteRef.current = e.target;
                }} value={addedNote}/>
              </li>
            )
          }))}
          {editState && <button className={classes.addItem} onClick={() => setAddedNotes(prev => prev.concat(''))}>Add Note</button>}
        </ul>
    );
  }, [classes, notes, edittedNotes, editState, addedNotes]);

  return (
    <Fragment>
      <div className={classes.thoughtInformation}>
        {editState ? (
          <Input
            classes={classes}
            value={edittedTitle}
            onChange={e => setEdittedTitle(e.target.value)}
            id={'thought-title'}
          />
        ) : (
          <Header classes={classes} value={thought.title}/>
        )}
        {edittingTime || editState ? (
          <Date
            id={'time'}
            classes={classes}
            value={thought.time}
            onChange={handleSetTime}
            time
            autoFocus={true}
          />
        ) : thought.time ? (
          <span className={classes.thoughtTime}>{thought.time}</span>
        ) : (
          <button id={'time-button'} className={'icon-button'} onClick={_ => setEdittingTime(true)}><AccessTime className={classes.timeIcon}/></button>
        )}
        {edittingDate || editState ? (
          <Date
            id={'date'}
            classes={classes}
            value={thought.date}
            onChange={handleSetDate}
            autoFocus={true}
          />
        ) : thought.date ? (
          <span className={classes.thoughtDate}>{thought.date}</span>
        ) : (
          <button id={'date-button'} className={'icon-button'} onClick={_ => setEdittingDate(true)}><CalendarToday className={classes.dateIcon}/></button>
        )}
        <Select
          id={'status'}
          classes={classes}
          value={thought.status}
          options={statusOptions}
          onChange={handleStatusChange}
        />
        {(thought.priority !== 0 || editState) && <span className={classes.priorityHeader}>Priority</span>}
        {(thought.priority !== 0 || editState) && (
          <Select
            id={'priority'}
            classes={classes}
            value={priorityOptions.find(({ value }) => value === thought.priority).label}
            options={priorityOptions.map(option => option.label)}
            onChange={handlePriorityChange}
          />
        )}
        {editState ? (
          <Select
            id={'type'}
            classes={classes}
            value={thought.type}
            options={typeOptions}
            onChange={handleTypeChange}
          />
        ) : (
          <span className={classes.thoughtType}>{thought.type}</span>
        )}
        {noteList}
        <ul className={classes.tagList}>
          {tags.map(({ text, id }, idx) => {
            return (
              <li className={classes.tagItem} key={`${idx}-note`}>{editState && (
                <button className={classes.deleteTagButton} onClick={handleDelete(id, 'tag')}><Delete className={classes.deleteTagIcon}/></button>
              )}{text}</li>
            );
          }).concat(addedTags.map((addedTag, idx) => {
            return (
              <Select
                classes={classes}
                key={`${idx}-added-note`}
                value={addedTag}
                id={'added-tag'}
                options={tagOptions.filter(option => {
                  return addedTag === option ||
                    option === 'Select' ||
                    tags.map(tag => tag.text).concat(addedTags).includes(option) === false;
                })}
                onChange={e => {
                  const value = e.target.value;
                  setAddedTags(prev => prev.map((prevValue, prevIdx) => prevIdx === idx ? value : prevValue));
                }}
              />
            );
          }))}
          {editState && <button className={`${classes.addItem} ${classes.tagItem}`} onClick={() => setAddedTags(prev => prev.concat('Select'))}>Add Tag</button>}
        </ul>    
        <span className={classes.thoughtDescription}>
          {thought.description}
        </span>
      </div>
      {editState ? (
        <CircleButton classes={classes} id={'edit'} onClick={handleClickCancelEdit} label={'Cancel'} Icon={Check}/>
      ) : (
        <CircleButton classes={classes} id={'edit'} onClick={handleClickEdit} label={'Edit'} Icon={Edit}/>
      )}
      {_autoSuggestComponent}
    </Fragment>
  );
});

const handleUpdates = async (
  db: RxDatabase,
  addedNotes: string[],
  addedTags: string[],
  edittedNotes: EditedMap,
  thought: Thought,
  tags: Tag[],
  notes: NoteType[],
  edittedTitle: string,
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

  if (edittedTitle !== thought.title) {
    await thoughtActions.editThought(db, Object.assign({}, thought, {
      title: edittedTitle,
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

export default ThoughtInformation;
