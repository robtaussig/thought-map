import React, { useEffect, Fragment, useCallback, useMemo, FC, Dispatch, useRef } from 'react';
import Input from '../General/Input';
import Select from '../General/Select';
import { useNestedXReducer, Action } from '../../hooks/useXReducer';
import { CreatedThought } from './';

interface InputsProps {
  classes: any;
  createdThought: CreatedThought;
  dispatch: Dispatch<Action>;
  typeOptions: string[];
  tagOptions: string[];
  onReady: (ready: boolean) => void;
  expanded: boolean;
}

export const Inputs: FC<InputsProps> = React.memo(({
  classes,
  createdThought,
  dispatch,
  typeOptions,
  tagOptions,
  onReady,
  expanded,
}) => {
  const focusTitleInput = useRef<() => {}>(null);
  const [title, setTitle] = useNestedXReducer('title', createdThought, dispatch);
  const [type, setType] = useNestedXReducer('type', createdThought, dispatch);
  const [date, setDate] = useNestedXReducer('date', createdThought, dispatch);
  const [time, setTime] = useNestedXReducer('time', createdThought, dispatch);
  const [description, setDescription] = useNestedXReducer('description', createdThought, dispatch);

  const isReady = validateInputs(title);

  useEffect(() => {
    onReady(isReady);
  }, [isReady]);

  const handleTypeChange= useCallback(e => setType(e.target.value), []);
  const handleDateChange= useCallback(e => setDate(e.target.value), []);
  const handleTimeChange= useCallback(e => setTime(e.target.value), []);
  const handleDescriptionChange= useCallback(e => setDescription(e.target.value), []);

  const _expandableContent = useMemo(() => {
    return expanded ? (
      <div className={classes.expandedContent}>Coming soon...</div>
    ) : null;
  },[expanded]);

  return (
    <Fragment>
      <Input classes={classes} id={'title'} value={title} onChange={e => setTitle(e.target.value)} autoFocus/>
      <Select classes={classes} id={'type'} value={type} options={typeOptions} onChange={e => setType(e.target.value)}/>
      {_expandableContent}
    </Fragment>
  );
});

export default Inputs;

const validateInputs = (title: string): boolean => {
  return title !== '';
};

/*
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
*/