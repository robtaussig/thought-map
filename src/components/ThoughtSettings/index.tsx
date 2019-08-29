import React, { FC } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircleButton from '../General/CircleButton';
import Delete from '@material-ui/icons/Delete';
import useModal from '../../hooks/useModal';
import Template from './components/template';
import Pictures from './components/Pictures';
import { Thought } from 'store/rxdb/schemas/thought';
import { Tag } from 'store/rxdb/schemas/tag';
import { Note } from 'store/rxdb/schemas/note';
import { styles } from './styles';

interface ThoughtSettingsProps {
  classes: any,
  display: boolean,
  thought: Thought,
  tags: Tag[],
  notes: Note[],
  onDelete: () => void,
}

export const ThoughtSettings: FC<ThoughtSettingsProps> = ({ classes, display, thought, tags, notes, onDelete }) => {
  const [openModal, closeModal] = useModal();

  const handleClickUseAsTemplate = () => {
    openModal(<Template classes={classes} onClose={closeModal} thought={thought} tags={tags} notes={notes}/>, 'Template');
  };

  const handleClickPictures = () => {
    openModal(<Pictures onClose={closeModal} thought={thought}/>, 'Pick a custom color');
  };

  const handleClickCustomBackground = () => {
    openModal(<div>Custom Background</div>, 'Pick a custom background');
  };

  const handleClickHideFields = () => {
    openModal(<div>Hide Fields</div>, 'Control Field Visibility');
  };

  return (
    <div className={classes.root} style={{
      top: display ? 0 : '100%',
      visibility: display ? 'visible' : 'hidden',
    }}>
      <div className={classes.settings}>
        <button className={classes.templateButton} onClick={handleClickUseAsTemplate}>Create Template</button>
        <button className={classes.color} onClick={handleClickPictures}>Pictures</button>
        <button className={classes.background} onClick={handleClickCustomBackground}>Custom Background</button>
        <button className={classes.fields} onClick={handleClickHideFields}>Hide Fields</button>
        <div className={classes.recurring}>Recurring</div>
        <CircleButton classes={classes} id={'delete-thought'} onClick={onDelete} label={'Delete Thought'} Icon={Delete}/>
      </div>
    </div>
  );
};

export default withStyles(styles)(ThoughtSettings);
