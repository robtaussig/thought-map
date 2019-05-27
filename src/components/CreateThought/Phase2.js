import React, { useEffect, useCallback } from 'react';
import PhaseHeader from './PhaseHeader';
import PhaseNext from './PhaseNext';
import FolderSpecial from '@material-ui/icons/FolderSpecial';
import Add from '@material-ui/icons/Add';
import Note from './Note';
import { useNestedXReducer } from '../../hooks/useXReducer';

export const Phase2 = React.memo(({ classes, onNext, isFocus, onFocus, createdThought, dispatch }) => {
  const [notes, setNotes] = useNestedXReducer('notes', createdThought, dispatch);
  const isReady = validateInputs();

  const handleSetNote = idx => e => {
    const nextValue = e.target.value;
    setNotes(notes.map((value, prevIdx) => prevIdx === idx ? nextValue : value));
  };

  const handleDeleteNote = idx => () => setNotes(notes.filter((_, prevIdx) => prevIdx !== idx));
  const handleAddNote = useCallback(() => setNotes(prev => prev.concat('')), []);

  return (
    <div className={`${classes.phase} ${classes.phase2} ${isFocus ? ' isFocus' : ''}`}>
      {!isFocus && <PhaseHeader classes={classes} value={`(${notes.length}) Notes`} onClick={onFocus}/>}
      {isFocus && <PhaseHeader classes={classes} value={'Notes'} onClick={onFocus}/>}
      {isFocus && notes.map((note, noteIdx) => {
        return <Note key={`${noteIdx}-note`} autoFocus={noteIdx === notes.length - 1} classes={classes} isFocus={isFocus} value={note} onChange={handleSetNote(noteIdx)} onRemove={handleDeleteNote(noteIdx)}/>;
      })}
      {isFocus && <button className={classes.addNoteButton} onClick={handleAddNote}><Add/></button>}
      {isFocus && isReady && <PhaseNext classes={classes} onClick={onNext} label={'Add Tags'} id={'add-tags'} Icon={FolderSpecial}/>}
    </div>
  );
});

export default Phase2;

const validateInputs = () => {
  return true;
};
