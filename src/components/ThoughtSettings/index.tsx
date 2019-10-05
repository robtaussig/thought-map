import React, { FC } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircleButton from '../General/CircleButton';
import Delete from '@material-ui/icons/Delete';
import useModal from '../../hooks/useModal';
import Template from './components/template';
import AddToCalendar from './components/Calendar';
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
  onEditSections: () => void;
}

export const ThoughtSettings: FC<ThoughtSettingsProps> = ({ classes, display, thought, tags, notes, onDelete, onEditSections }) => {
  const [openModal, closeModal] = useModal();

  const handleClickUseAsTemplate = () => {
    openModal(<Template classes={classes} onClose={closeModal} thought={thought} tags={tags} notes={notes}/>, 'Template');
  };

  const handleClickAddToCalendar = () => {
    openModal(<AddToCalendar onClose={closeModal} thoughtId={thought.id} notes={notes} tags={tags}/>);
  };

  const handleClickHideFields = () => {
    openModal(<div>Hide Fields</div>, 'Control Field Visibility');
  };

  const handleClickEditSections = () => {
    onEditSections();
  };

  return (
    <div className={classes.root} style={{
      top: display ? 0 : '100%',
      visibility: display ? 'visible' : 'hidden',
    }}>
      <div className={classes.settings}>
        <button className={classes.templateButton} onClick={handleClickUseAsTemplate}>Create Template</button>
        <button className={classes.background} onClick={handleClickAddToCalendar}>Add/Manage Calendar Event</button>
        <button className={classes.fields} onClick={handleClickEditSections}>Edit Sections</button>        
        {display && <CircleButton classes={classes} id={'delete-thought'} onClick={onDelete} label={'Delete Thought'} Icon={Delete}/>}
      </div>
    </div>
  );
};

export default withStyles(styles)(ThoughtSettings);
