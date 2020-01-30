import React, { useState, FC, FormEvent } from 'react';
import Header from '../../General/Header';
import Input, { InputChangeHandler } from '../../General/Input';
import { templates as templateActions } from '../../../actions';
import { useLoadedDB } from '../../../hooks/useDB';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { Note } from '../../../store/rxdb/schemas/note';
import { Tag } from '../../../store/rxdb/schemas/tag';

interface TemplateProps {
  classes: any;
  onClose: () => void;
  thought: Thought;
  notes: Note[];
  tags: Tag[];
}

type TemplateThought = Omit<Thought, 'id'|'thoughtId'|'planId'|'created'|'updated'|'deleted'|'_rev'>
type TemplateNote = Omit<Note, 'id'|'thoughtId'|'planId'|'created'|'updated'|'deleted'|'_rev'>
type TemplateTag = Omit<Tag, 'id'|'thoughtId'|'planId'|'created'|'updated'|'deleted'|'_rev'>

interface TemplateType {
  thought: TemplateThought;
  notes: TemplateNote[];
  tags: TemplateTag[];
}

export const Template: FC<TemplateProps> = ({ classes, onClose, thought, notes, tags }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const { db } = useLoadedDB();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const template: TemplateType = {
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

  const handleInput: InputChangeHandler = e => setInputValue(e.target.value);

  return (
    <div className={classes.templateSettings}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Header classes={classes} value={'Create Template'}/>
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

const stripNonGeneralFields = ({ id, thoughtId, planId, created, updated, deleted, _rev, ...rest}: any) => ({
  ...rest,
});

export default Template;
