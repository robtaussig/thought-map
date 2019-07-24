import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Header from '../General/Header';
import Input from '../General/Input';
import Select from '../General/Select';
import Date from '../General/Date';
import TextArea from '../General/TextArea';
import PhaseNext from './PhaseNext';
import Notes from '@material-ui/icons/Notes';
import ExpandLess from '@material-ui/icons/ExpandLess';
import { useNestedXReducer } from '../../hooks/useXReducer';
import { useAutoSuggest } from '../../hooks/useAutoSuggest';

export const Phase1 = React.memo(({
  classes,
  onNext,
  isFocus,
  onReady,
  onFocus,
  createdThought,
  dispatch,
  focusTitleInput,
  thoughts,
}) => {
  const [title, setTitle] = useNestedXReducer('title', createdThought, dispatch);
  const [typeOptions, setTypeOptions] = useNestedXReducer('typeOptions', createdThought, dispatch);
  const [type, setType] = useNestedXReducer('type', createdThought, dispatch);
  const [date, setDate] = useNestedXReducer('date', createdThought, dispatch);
  const [time, setTime] = useNestedXReducer('time', createdThought, dispatch);
  const [description, setDescription] = useNestedXReducer('description', createdThought, dispatch);
  const [focusDescription, setFocusDescription] = useState(false);
  const [displayTitleAutoCorrect, setDisplayTitleAutoCorrect] = useState(false);

  const thoughtTitles = useMemo(() => thoughts.map(({ title }) => title), [thoughts]);
  const titleSuggestions = useAutoSuggest(title.trim(), thoughtTitles);

  const isReady = validateInputs(title, type, date, description);

  const handleNext = () => {
    setFocusDescription(false);
    onNext();
  };

  useEffect(() => {
    onReady(isReady);
  }, [isReady]);

  const handleTitleChange= useCallback(e => setTitle(e.target.value), []);
  const handleTypeChange= useCallback(e => setType(e.target.value), []);
  const handleDateChange= useCallback(e => setDate(e.target.value), []);
  const handleTimeChange= useCallback(e => setTime(e.target.value), []);
  const handleDescriptionChange= useCallback(e => setDescription(e.target.value), []);
  const handleTitleFocus = useCallback(e => {
    setDisplayTitleAutoCorrect(true);
  }, []);

  return (
    <div className={`${classes.phase} ${classes.phase1} ${isFocus ? ' isFocus' : ''}`}>
      {!isFocus && 
        <Header classes={classes} value={'Edit'} onClick={onFocus}/>}
      {(!focusDescription || !isFocus) &&
        <Input id={'title'} classes={classes} value={title} onChange={handleTitleChange} label={'Title'} onInputFocus={handleTitleFocus} onFocus={focusTitleInput} autoSuggest={displayTitleAutoCorrect ? titleSuggestions : null}/>}
      {!focusDescription && isFocus &&
        <Select id={'type'} classes={classes} value={type} options={typeOptions} onChange={handleTypeChange} label={'Type'}/>}
      {!focusDescription && isFocus &&
        <Date id={'date'} classes={classes} value={date} onChange={handleDateChange} label={'Date'}/>}
      {!focusDescription && isFocus &&
        <Date id={'time'} time classes={classes} value={time} onChange={handleTimeChange} label={'Time'}/>}
      {focusDescription &&
        <button className={classes.hideDescriptionButton} aria-label={'Hide Description'} onClick={() => setFocusDescription(false)}><ExpandLess/></button>}
      {isFocus && 
        <TextArea id={'description'} classes={classes} value={description} onFocus={() => setFocusDescription(true)} onChange={handleDescriptionChange} label={'Description'}/>}
      {isFocus && isReady && 
        <PhaseNext classes={classes} onClick={handleNext} label={'Add Notes'} id={'add-notes'} Icon={Notes}/>}
    </div>
  );
});

export default Phase1;

const validateInputs = (title, type, date, description) => {
  return title !== '';
};
