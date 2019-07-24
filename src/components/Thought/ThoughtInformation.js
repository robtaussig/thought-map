import React, { useCallback, useState, useMemo, useEffect, Fragment } from 'react';
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
import { useAutoSuggest } from '../../hooks/useAutoSuggest';

export const ThoughtInformation = React.memo(({
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
  const [edittingTime, setEdittingTime] = useState(false);
  const [edittingDate, setEdittingDate] = useState(false);
  const [edittedNotes, setEdittedNotes] = useState({});
  const [edittedTitle, setEdittedTitle] = useState(thought.title);
  const [addedNotes, setAddedNotes] = useState([]);
  const [addedTags, setAddedTags] = useState([]);
  const db = useLoadedDB();
  const [lastNote, setLastNote] = useState([null, '']);
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
  }, [thought]);

  const handleClickCancelEdit = () => {
    handleUpdates(db, addedNotes, addedTags.filter(tag => tag !== 'Select'), edittedNotes, thought, tags, notes, edittedTitle, reset);
    onEditState(false);
  };
  
  const handleTypeChange = useCallback(event => {
    onUpdate({ ...thought, type: event.target.value })
  }, [thought]);

  const handleInput = useCallback(id => {
    return (e, isNew = false) => {
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

  const handleDelete = useCallback((id, type) => {
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

    const handleClickSuggestion = suggestionValue => {
      if (suggestionValue.startsWith(' ')) {
        handleInput(lastNote[0])({
          target: {
            value: `${lastNote[1]}${suggestionValue} `
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
        <ul className={classes.noteList}>
          {notes.map(({ text, id }, idx) => {
            return editState ? (
              <li className={classes.noteItem} key={`${idx}-note`}>
                <button className={classes.deleteIcon} onClick={handleDelete(id, 'note')}><Delete/></button>
                <input className={classes.noteEditInput} onChange={handleInput(id)} value={edittedNotes[id] || text}/>
              </li>
            ) : (
              <li className={classes.noteItem} key={`${idx}-note`}><Note className={classes.noteIcon}/>{text}</li>
            );
          }).concat(addedNotes.map((addedNote, idx) => {
            return (
              <li className={classes.noteItem} key={`${idx}-added-note`}>
                <button className={classes.deleteIcon} onClick={() => setAddedNotes(prev => prev.filter((_, prevIdx) => prevIdx !== idx))}><Delete/></button>
                <input className={classes.noteEditInput} onChange={e => {
                  const value = e.target.value;
                  handleInput(idx)({
                    target: {
                      value,
                    }
                  }, true);
                }} value={addedNote}/>
              </li>
            )
          }))}
          {editState && <button className={classes.addItem} onClick={() => setAddedNotes(prev => prev.concat(''))}>Add Note</button>}
        </ul>
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

const handleUpdates = async (db, addedNotes, addedTags, edittedNotes, thought, tags, notes, edittedTitle, reset) => {
  const notesToAdd = [];
  const tagsToAdd = [];
  const notesToEdit = [];
  const tagsToEdit = [];

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
