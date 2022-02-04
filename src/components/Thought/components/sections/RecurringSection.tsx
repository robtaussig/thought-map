import React, { FC } from 'react';
import ThoughtSection from './ThoughtSection';
import Autorenew from '@material-ui/icons/Autorenew';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { EditTypes, SectionState } from '../../types';

interface RecurringSectionProps {
  classes: any;
  thought: Thought;
  onEdit: (value: number) => void;
  sectionState: SectionState;
  onToggleVisibility: () => void;
  sectionOrder: string[];
  visible: boolean;
}

export const RecurringSection: FC<RecurringSectionProps> = ({ classes, sectionOrder, thought, onEdit, sectionState, onToggleVisibility, visible = true }) => {

  const handleEdit = (value: string) => {
    onEdit(Number(value));
  };

  return (
    <ThoughtSection
      classes={classes}
      sectionOrder={sectionOrder}
      section={'recurring'}
      Icon={Autorenew}
      field={'Recurring (hours)'}
      value={String(thought.recurring || 0)}
      className={'recurring'}
      visible={visible}
      sectionState={sectionState}
      onToggleVisibility={onToggleVisibility}
      edit={{
        type: EditTypes.Number,
        onEdit: handleEdit,
      }}
    />
  );
};

export default RecurringSection;
