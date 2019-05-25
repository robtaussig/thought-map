import React, { useEffect } from 'react';
import PhaseHeader from './PhaseHeader';
import PhaseInput from './PhaseInput';
import PhaseSelect from './PhaseSelect';
import PhaseDate from './PhaseDate';
import PhaseDescription from './PhaseDescription';
import PhaseNext from './PhaseNext';
import Notes from '@material-ui/icons/Notes';
import { useNestedReducer } from '../../hooks/useNestedReducer';

export const Phase1 = React.memo(({ classes, onNext, isFocus, onReady, onFocus, createdThought, dispatch }) => {
  const [title, setTitle] = useNestedReducer('title', createdThought, dispatch);
  const [typeOptions, setTypeOptions] = useNestedReducer('typeOptions', createdThought, dispatch);
  const [type, setType] = useNestedReducer('type', createdThought, dispatch);
  const [date, setDate] = useNestedReducer('date', createdThought, dispatch);
  const [description, setDescription] = useNestedReducer('description', createdThought, dispatch);

  const isReady = validateInputs(title, type, date, description);

  useEffect(() => {
    onReady(isReady);
  }, [isReady]);

  return (
    <div className={`${classes.phase} ${classes.phase1} ${isFocus ? ' isFocus' : ''}`}>
      {!isFocus && <PhaseHeader classes={classes} value={'Edit Basics'} onClick={onFocus}/>}
      <PhaseInput id={'title'} classes={classes} value={title} onChange={e => setTitle(e.target.value)} label={'Title'}/>
      <PhaseSelect id={'type'} classes={classes} value={type} options={typeOptions} onChange={e => setType(e.target.value)} label={'Type'}/>
      <PhaseDate id={'date'} classes={classes} value={date} onChange={e => setDate(e.target.value)} label={'Date'}/>
      {isFocus && <PhaseDescription id={'description'} classes={classes} value={description} onChange={e => setDescription(e.target.value)} label={'Description'}/>}
      {isFocus && isReady && <PhaseNext classes={classes} onClick={onNext} label={'Add Notes'} id={'add-notes'} Icon={Notes}/>}
    </div>
  );
});

export default Phase1;

const validateInputs = (title, type, date, description) => {
  return title !== '';
};
