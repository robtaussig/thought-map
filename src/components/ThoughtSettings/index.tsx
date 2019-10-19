import React, { FC } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircleButton from '../General/CircleButton';
import Delete from '@material-ui/icons/Delete';
import useModal from '../../hooks/useModal';
import useApp from '../../hooks/useApp';
import { homeUrl } from '../../lib/util';
import Template from './components/template';
import AddToCalendar from './components/Calendar';
import { Thought } from 'store/rxdb/schemas/thought';
import { Tag } from 'store/rxdb/schemas/tag';
import { Note } from 'store/rxdb/schemas/note';
import { styles } from './styles';
import Tooltip from '../General/Tooltip';

interface ThoughtSettingsProps {
  classes: any;
  display: boolean;
  thought: Thought;
  tags: Tag[];
  notes: Note[];
  onDelete: () => void;
  onEditSections: () => void;
  onApplySectionState: () => void;
}

const APPLY_SECTION_STATE_TOOLTIP_TEXT = 'Will apply this thought\'s section structure as the default structure for all thoughts within the same plan.';

export const ThoughtSettings: FC<ThoughtSettingsProps> = ({ classes, display, onApplySectionState, thought, tags, notes, onDelete, onEditSections }) => {
  const [openModal, closeModal] = useModal();
  const { history } = useApp();
  const handleClickUseAsTemplate = () => {
    openModal(<Template classes={classes} onClose={closeModal} thought={thought} tags={tags} notes={notes}/>, 'Template');
  };

  const handleClickAddToCalendar = () => {
    openModal(<AddToCalendar onClose={closeModal} thoughtId={thought.id} notes={notes} tags={tags}/>);
  };

  const handleClickApplySectionState = () => {
    onApplySectionState();
  };

  const handleClickEditSections = () => {
    onEditSections();
  };

  const handleClickViewConnections = () => {
    history.push(`${homeUrl(history)}thought/${thought.id}/connections`);
  };

  return (
    <div className={classes.root} style={{
      top: display ? 0 : '100%',
      visibility: display ? 'visible' : 'hidden',
    }}>
      <div className={classes.settings}>
        <button onClick={handleClickUseAsTemplate}>Create Template</button>
        <button onClick={handleClickViewConnections}>View Connections</button>
        <button onClick={handleClickAddToCalendar}>Manage Calendar</button>
        <button onClick={handleClickEditSections}>Edit Sections</button>
        <div className={classes.applySectionState}>
          <button className={classes.sectionStateButton} onClick={handleClickApplySectionState}>Apply SectionState</button>
          <Tooltip text={APPLY_SECTION_STATE_TOOLTIP_TEXT}/>
        </div>
        {display && <CircleButton classes={classes} id={'delete-thought'} onClick={onDelete} label={'Delete Thought'} Icon={Delete}/>}
      </div>
    </div>
  );
};

export default withStyles(styles)(ThoughtSettings);
