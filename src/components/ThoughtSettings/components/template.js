import React, { useState } from 'react';
import Header from '../../General/Header';
import Input from '../../General/Input';
import { templates as templateActions } from '../../../actions';
import { useLoadedDB } from '../../../hooks/useDB';

export const Template = ({ classes, onClose, thought, notes, tags }) => {
  const [inputValue, setInputValue] = useState('');
  const db = useLoadedDB();

  const handleSubmit = async e => {
    e.preventDefault();
    const template = {
      thought: stripNonGeneralFields(thought),
      notes: notes.map(stripNonGeneralFields),
      tags: tags.map(stripNonGeneralFields),
    };
    const wholeTemplate = {
      name: inputValue,
      template,
    };

    await templateActions.createTemplate(db, wholeTemplate);
    onClose();
  };

  const handleInput = e => setInputValue(e.target.value);

  return (
    <div className={classes.templateSettings}>
      <Header classes={classes} value={'Create Template'}/>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Input
          classes={classes}
          value={inputValue}
          onChange={handleInput}
          placeholder={'Name'}
          id={'template-name'}
          autoFocus
        />
        <button className={classes.submitButton}>Create</button>
      </form>
    </div>
  );
};

const stripNonGeneralFields = ({ id, thoughtId, planId, created, updated, deleted, _rev, ...rest}) => ({
  ...rest,
});

export default Template;
