import React, { useCallback, useState, useMemo, FC, Dispatch, ChangeEvent } from 'react';
import Header from '../General/Header';
import PhaseNext from './PhaseNext';
import FolderSpecial from '@material-ui/icons/FolderSpecial';
import Add from '@material-ui/icons/Add';
import Note from './Note';
import { useNestedXReducer, Action } from '../../hooks/useXReducer';
import useAutoSuggest from 'react-use-autosuggest';
import { CreatedThought } from './';
import { InputChangeHandler } from '~components/General/Input';
import { Note as NoteType } from 'store/rxdb/schemas/note';

interface Phase2Props {
  classes: any,
  onNext: () => void,
  isFocus: boolean,
  onFocus: () => void,
  createdThought: CreatedThought,
  dispatch: Dispatch<Action>,
  notes: NoteType[],
}

export const Phase2: FC<Phase2Props> = React.memo(({
  classes,
  onNext,
  isFocus,
  onFocus,
  createdThought,
  dispatch,
  notes: stateNotes,
}) => {
  const [notes, setNotes] = useNestedXReducer('notes', createdThought, dispatch);
  const isReady = validateInputs();
  const [lastNote, setLastNote] = useState<[number, string]>([-1, '']);
  
  const handleSetNote = (idx: number): InputChangeHandler => e => {
    const nextValue = e.target.value;
    setLastNote([idx, nextValue]);
    setNotes(notes.map((value, prevIdx) => prevIdx === idx ? nextValue : value));
  };

  const handleDeleteNote = (idx: number) => () => setNotes(notes.filter((_, prevIdx) => prevIdx !== idx));
  const handleAddNote = useCallback(() => setNotes(prev => prev.concat('')), []);
  const autoSuggestNotes = useMemo(() => {
    return Object.values(stateNotes).map(({ text }) => text);
  }, [stateNotes]);
  const noteSuggestions: string[] = useAutoSuggest(lastNote[1].trim(), autoSuggestNotes, 4);

  return (
    <div className={`${classes.phase} ${classes.phase2} ${isFocus ? ' isFocus' : ''}`}>
      {!isFocus && <Header classes={classes} value={`(${notes.length}) Notes`} onClick={onFocus}/>}
      {isFocus && <Header classes={classes} value={'Notes'} onClick={onFocus}/>}
      {isFocus && notes.map((note, noteIdx) => {
        return (
          <Note key={`${noteIdx}-note`}
            autoFocus={noteIdx === notes.length - 1}
            classes={classes}
            isFocus={isFocus}
            value={note}
            onChange={handleSetNote(noteIdx)}
            onRemove={handleDeleteNote(noteIdx)}
            autoSuggest={lastNote[0] === noteIdx && noteSuggestions && noteSuggestions.length > 0 ? noteSuggestions : null}
          />
        );
      })}
      {isFocus && <button className={classes.addNoteButton} onClick={handleAddNote}><Add/></button>}
      {isFocus && isReady && <PhaseNext classes={classes} onClick={onNext} label={'Add Tags'} id={'add-tags'} Icon={FolderSpecial}/>}
    </div>
  );
});

export default Phase2;

const validateInputs = (): boolean => {
  return true;
};
