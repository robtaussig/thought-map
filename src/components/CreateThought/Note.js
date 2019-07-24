import React, { Fragment } from 'react';
import Input from '../General/Input';
import Delete from '@material-ui/icons/Delete';

export const Note = React.memo(({ classes, value, onChange, onRemove, isFocus, autoFocus, autoSuggest }) => {
  const DeleteButton = isFocus ? (<button className={classes.deleteNoteButton} onClick={onRemove} aria-label={'Delete'}><Delete/></button>) : null;

  return (
    <Fragment>
      <Input
        scrollToOnMount
        id={'note'}
        classes={classes}
        autoSuggest={autoSuggest}
        value={value}
        onChange={onChange}
        label={'Note'}
        DeleteButton={DeleteButton}
        autoFocus
      />
    </Fragment>
  );
});

export default Note;
