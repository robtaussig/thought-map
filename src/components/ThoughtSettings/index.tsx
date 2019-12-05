import React, { FC, ChangeEventHandler } from 'react';
import { withStyles } from '@material-ui/core/styles';
import useModal from '../../hooks/useModal';
import Template from './components/template';
import AddToCalendar from './components/Calendar';
import { Thought } from 'store/rxdb/schemas/thought';
import { Tag } from 'store/rxdb/schemas/tag';
import { Note } from 'store/rxdb/schemas/note';
import { styles } from './styles';
import Tooltip from '../General/Tooltip';
import CheckBox from '../General/CheckBox';

interface ThoughtSettingsProps {
  classes: any;
  display: boolean;
  thought: Thought;
  tags: Tag[];
  notes: Note[];
  onEditSections: () => void;
  onApplySectionState: () => void;
  onChangeHideFromHomeScreen: (checked: boolean) => void;
}

const APPLY_SECTION_STATE_TOOLTIP_TEXT = 'Will apply this thought\'s section structure as the default structure for all thoughts within the same plan.';

export const ThoughtSettings: FC<ThoughtSettingsProps> = ({
  classes,
  display,
  onApplySectionState,
  thought,
  tags,
  notes,
  onEditSections,
  onChangeHideFromHomeScreen,
}) => {
  const [openModal, closeModal] = useModal();
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

  const handleCheckHideFromHomeScreen: ChangeEventHandler<HTMLInputElement> = e => {
    onChangeHideFromHomeScreen(e.target.checked);
  };

  return (
    <div className={classes.root} style={{
      top: display ? 0 : '100%',
      visibility: display ? 'visible' : 'hidden',
    }}>
      <div className={classes.settings}>
        <button onClick={handleClickUseAsTemplate}>Create Template</button>
        <button onClick={handleClickAddToCalendar}>Manage Calendar</button>
        <button onClick={handleClickEditSections}>Edit Sections</button>
        <div className={classes.applySectionState}>
          <button className={classes.sectionStateButton} onClick={handleClickApplySectionState}>Apply SectionState</button>
          <Tooltip text={APPLY_SECTION_STATE_TOOLTIP_TEXT}/>
        </div>
        <CheckBox
          id={'hide-from-home-screen'}
          classes={classes}
          isChecked={Boolean(thought && thought.hideFromHomeScreen)}
          value={'Hide From Home'}
          label={'Hide From Home'}
          onChange={handleCheckHideFromHomeScreen}
        />
      </div>
    </div>
  );
};

export default withStyles(styles)(ThoughtSettings);
