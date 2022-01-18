import React, { FC, Fragment } from 'react';
import Input, { InputChangeHandler } from '../General/Input';
import Delete from '@material-ui/icons/Delete';

interface NoteProps {
  classes: any;
  value: string;
  onChange: InputChangeHandler;
  onRemove: () => void;
  isFocus?: boolean;
  autoFocus?: boolean;
  autoSuggest?: string[];
}

export const Note: FC<NoteProps> = ({ classes, value, onChange, onRemove, isFocus, autoSuggest }) => {
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
};

export default Note;
