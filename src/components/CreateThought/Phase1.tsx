import React, { useEffect, useState, useCallback, useMemo, FC, Dispatch, useRef } from 'react';
import Header from '../General/Header';
import Input from '../General/Input';
import Select from '../General/Select';
import Date from '../General/Date';
import TextArea from '../General/TextArea';
import ExpandLess from '@material-ui/icons/ExpandLess';
import { useNestedXReducer, Action } from '../../hooks/useXReducer';
import useAutoSuggest from 'react-use-autosuggest';
import { CreatedThought } from './';
import { Thought } from '../../store/rxdb/schemas/thought';
import { SettingState } from '../../types';

interface Phase1Props {
  classes: any;
  onNext: () => void;
  isFocus: boolean;
  onReady: (isReady: boolean) => void;
  onFocus: () => void;
  createdThought: CreatedThought;
  dispatch: Dispatch<Action>;
  thoughts: Thought[];
  settings: SettingState;
}

export const Phase1: FC<Phase1Props> = React.memo(({
  classes,
  onNext,
  isFocus,
  onReady,
  onFocus,
  createdThought,
  dispatch,
  thoughts,
  settings,
}) => {
  const focusTitleInput = useRef<() => {}>(null);
  const [title, setTitle] = useNestedXReducer('title', createdThought, dispatch);
  const [typeOptions, setTypeOptions] = useNestedXReducer('typeOptions', createdThought, dispatch);
  const [type, setType] = useNestedXReducer('type', createdThought, dispatch);
  const [date, setDate] = useNestedXReducer('date', createdThought, dispatch);
  const [time, setTime] = useNestedXReducer('time', createdThought, dispatch);
  const [description, setDescription] = useNestedXReducer('description', createdThought, dispatch);
  const [focusDescription, setFocusDescription] = useState(false);
  const [currentAutoSuggest, setCurrentAutoSuggest] = useState('');

  const thoughtTitles = useMemo(() => settings.useAutoSuggest ? thoughts.map(({ title }) => title) : [], [thoughts, settings.useAutoSuggest]);
  const titleSuggestions = useAutoSuggest(title.trim(), thoughtTitles, 4);

  const isReady = validateInputs(title);

  useEffect(() => {
    onReady(isReady);
  }, [isReady]);

  const handleTitleChange= useCallback(e => setTitle(e.target.value), []);
  const handleTypeChange= useCallback(e => setType(e.target.value), []);
  const handleDateChange= useCallback(e => setDate(e.target.value), []);
  const handleTimeChange= useCallback(e => setTime(e.target.value), []);
  const handleDescriptionChange= useCallback(e => setDescription(e.target.value), []);
  const handleFocusField = (field: string) => () => setCurrentAutoSuggest(field);
  const setFocus = useCallback(focus => focusTitleInput.current = focus, []);
  useEffect(() => {
    focusTitleInput.current();
  }, []);
  return (
    <div className={`${classes.phase} ${classes.phase1} ${isFocus ? ' isFocus' : ''}`}>
      {!isFocus && 
        <Header classes={classes} value={'Edit'} onClick={onFocus}/>}
      {!focusDescription &&
        <Input
          id={'title'}
          classes={classes}
          value={title}
          onChange={handleTitleChange}
          label={'Title'}
          onFocus={handleFocusField('title')}
          setFocus={setFocus}
          autoSuggest={currentAutoSuggest === 'title' ? titleSuggestions : null}
        />
      }
      {!focusDescription && isFocus &&
        <Select
          id={'type'}
          classes={classes}
          value={type}
          options={typeOptions}
          onChange={handleTypeChange}
          onFocus={handleFocusField('type')}
          label={'Type'}
        />
      }
      {!focusDescription && isFocus &&
        <Date
          id={'date'}
          classes={classes}
          value={date}
          onChange={handleDateChange}
          onFocus={handleFocusField('date')}
          label={'Date'}
        />
      }
      {!focusDescription && isFocus &&
        <Date
          id={'time'}
          time
          classes={classes}
          value={time}
          onChange={handleTimeChange}
          onFocus={handleFocusField('time')}
          label={'Time'}
        />
      }
      {focusDescription &&
        <button className={classes.hideDescriptionButton} aria-label={'Hide Description'} onClick={() => setFocusDescription(false)}><ExpandLess/></button>}
      {isFocus && 
        <TextArea id={'description'} classes={classes} value={description} onFocus={() => {
          handleFocusField('description');
          setFocusDescription(true);
        }} onChange={handleDescriptionChange} label={'Description'}/>}
    </div>
  );
});

export default Phase1;

const validateInputs = (title: string): boolean => {
  return title !== '';
};
