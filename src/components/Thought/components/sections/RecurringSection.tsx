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
  onLongPress: (e: any) => void;
  onDrop: () => void;
  onToggleVisibility: () => void;
  visible: boolean;
}

export const RecurringSection: FC<RecurringSectionProps> = ({ classes, thought, onEdit, sectionState, onLongPress, onDrop, onToggleVisibility, visible = true }) => {

  const handleEdit = (value: string) => {
    onEdit(Number(value));
  };

  return (
    <ThoughtSection
      classes={classes}
      Icon={Autorenew}
      field={'Recurring (hours)'}
      value={String(thought.recurring || 0)}
      className={'recurring'}
      visible={visible}
      sectionState={sectionState}
      onLongPress={onLongPress}
      onDrop={onDrop}
      onToggleVisibility={onToggleVisibility}
      edit={{
        type: EditTypes.Number,
        onEdit: handleEdit,
      }}
    />
  );
};

export default RecurringSection;
