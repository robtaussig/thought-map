import React, { Fragment } from 'react';
import PhaseInput from './PhaseInput';
import Delete from '@material-ui/icons/Delete';

export const Note = React.memo(({ classes, value, onChange, onRemove, isFocus }) => {

  const DeleteButton = isFocus ? (<button className={classes.deleteNoteButton} onClick={onRemove} aria-label={'Delete'}><Delete/></button>) : null;

  return (
    <Fragment>
      <PhaseInput id={'note'} classes={classes} value={value} onChange={onChange} label={'Note'} DeleteButton={DeleteButton}/>
    </Fragment>
  );
});

export default Note;
