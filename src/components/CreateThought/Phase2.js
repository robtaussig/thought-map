import React, { useState, useEffect, useCallback } from 'react';
import PhaseHeader from './PhaseHeader';
import PhaseInput from './PhaseInput';
import PhaseSelect from './PhaseSelect';
import PhaseDate from './PhaseDate';
import PhaseDescription from './PhaseDescription';
import PhaseNext from './PhaseNext';
import Notes from '@material-ui/icons/Notes';
import Add from '@material-ui/icons/Add';
import Note from './Note';
import { useNestedReducer } from '../../hooks/useNestedReducer';

export const Phase2 = React.memo(({ classes, onNext, isFocus, onReady, onFocus, createdThought, dispatch }) => {
  const [notes, setNotes] = useNestedReducer('notes', createdThought, dispatch);
  const isReady = validateInputs();

  useEffect(() => {
    onReady(isReady);
  }, [isReady]);

  const handleSetNote = idx => e => {
    const nextValue = e.target.value;
    setNotes(notes.map((value, prevIdx) => prevIdx === idx ? nextValue : value));
  };

  const handleDeleteNote = idx => () => setNotes(notes.filter((_, prevIdx) => prevIdx !== idx));
  const handleAddNote = useCallback(() => setNotes(prev => prev.concat('')), []);

  return (
    <div className={`${classes.phase} ${classes.phase2} ${isFocus ? ' isFocus' : ''}`}>
      {isFocus && <PhaseHeader classes={classes} value={'Notes'} onClick={onFocus}/>}
      {notes.map((note, noteIdx) => {
        return <Note key={`${noteIdx}-note`} classes={classes} isFocus={isFocus} value={note} onChange={handleSetNote(noteIdx)} onRemove={handleDeleteNote(noteIdx)}/>;
      })}
      {isFocus && <button className={classes.addNoteButton} onClick={handleAddNote}><Add/></button>}
      {isFocus && isReady && <PhaseNext classes={classes} onClick={onNext} label={'Add Tags'} id={'add-tags'} Icon={Notes}/>}
    </div>
  );
});

export default Phase2;

const validateInputs = () => {
  return true;
};
