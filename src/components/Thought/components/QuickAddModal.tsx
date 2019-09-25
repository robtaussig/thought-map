import React, { FC, useState, FormEventHandler, MouseEventHandler } from 'react';
import Input from '../../General/Input';

interface QuickAddModalProps {
  classes: any,
  onClose: () => void;
  onSubmit: (value: string) => void;
}

export const QuickAddModal: FC<QuickAddModalProps> = ({ classes, onClose, onSubmit }) => {
  const [inputtedValue, setInputtedValue] = useState<string>('');

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault();
    onSubmit(inputtedValue);
  };

  const handleClickCancel: MouseEventHandler = e => {
    e.preventDefault();
    onClose();
  }

  return (
    <form className={classes.quickAddForm} onSubmit={handleSubmit}>
      <Input
        classes={classes}
        id={'quick-add'}
        value={inputtedValue}
        onChange={e => setInputtedValue(e.target.value)}
        aria-label={'Item Name'}
        autoFocus
      />
      <button className={classes.submitQuickAddButton} disabled={inputtedValue === ''}>Submit</button>
      <button className={classes.cancelQuickAddButton} onClick={handleClickCancel}>Cancel</button>
    </form>
  );
};

export default QuickAddModal;
