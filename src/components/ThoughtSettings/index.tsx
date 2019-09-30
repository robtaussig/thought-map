import React, { FC } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircleButton from '../General/CircleButton';
import Delete from '@material-ui/icons/Delete';
import useModal from '../../hooks/useModal';
import Template from './components/template';
import AddToCalendar from './components/add-to-calendar';
import { Thought } from 'store/rxdb/schemas/thought';
import { Tag } from 'store/rxdb/schemas/tag';
import { Note } from 'store/rxdb/schemas/note';
import { styles } from './styles';

interface ThoughtSettingsProps {
  classes: any;
  display: boolean;
  thought: Thought;
  tags: Tag[];
  notes: Note[];
  onDelete: () => void;
}

export const ThoughtSettings: FC<ThoughtSettingsProps> = ({ classes, display, thought, tags, notes, onDelete }) => {
  const [openModal, closeModal] = useModal();

  const handleClickUseAsTemplate = () => {
    openModal(<Template classes={classes} onClose={closeModal} thought={thought} tags={tags} notes={notes}/>, 'Template');
  };

  const handleClickAddToCalendar = () => {
    openModal(<AddToCalendar classes={classes} onClose={closeModal} thought={thought} notes={notes} tags={tags}/>);
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
        <button className={classes.background} onClick={handleClickAddToCalendar}>Add to Calendar</button>
        <button className={classes.fields} onClick={handleClickHideFields}>Hide Fields</button>
        <div className={classes.recurring}>Recurring</div>
        {display && <CircleButton classes={classes} id={'delete-thought'} onClick={onDelete} label={'Delete Thought'} Icon={Delete}/>}
      </div>
    </div>
  );
};

export default withStyles(styles)(ThoughtSettings);
