import React, { FC, useState, FormEventHandler, MouseEventHandler } from 'react';
import Input from '../../General/Input';
import Select from '../../General/Select';

interface QuickAddModalProps {
  classes: any,
  onClose: () => void;
  onSubmit: (value: string) => void;
  autoSuggest?: string[];
  options: string[];
}

export const QuickAddModal: FC<QuickAddModalProps> = ({ classes, onClose, onSubmit, options, autoSuggest }) => {
  const [inputtedValue, setInputtedValue] = useState<string>('');

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault();
    onSubmit(inputtedValue);
  };

  const handleClickCancel: MouseEventHandler = e => {
    e.preventDefault();
    onClose();
  }

  return options ? (
    <Select
      classes={classes}
      id={'tag-select'}
      value={'Select Tag'} //Improve
      onChange={e => onSubmit(e.target.value)}
      options={options}
      aria-label={'Options'}
    />
  ) : (
    <form className={classes.quickAddForm} onSubmit={handleSubmit}>
      <Input
        classes={classes}
        id={'quick-add'}
        value={inputtedValue}
        onChange={e => setInputtedValue(e.target.value)}
        aria-label={'Item Name'}
        autoSuggest={autoSuggest}
        autoFocus
      />
      <button className={classes.submitQuickAddButton} disabled={inputtedValue === ''}>Submit</button>
      <button className={classes.cancelQuickAddButton} onClick={handleClickCancel}>Cancel</button>
    </form>
  );
};

export default QuickAddModal;
