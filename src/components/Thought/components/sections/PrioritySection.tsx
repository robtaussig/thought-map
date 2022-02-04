import React, { FC } from 'react';
import ThoughtSection from './ThoughtSection';
import LowPriority from '@material-ui/icons/LowPriority';
import PriorityHighRounded from '@material-ui/icons/PriorityHighRounded';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { EditTypes, SectionState } from '../../types';
import { PriorityOption } from '../../';

interface PrioritySectionProps {
  classes: any;
  thought: Thought;
  priorityOptions: PriorityOption[];
  onEdit: (value: number) => void;
  sectionState: SectionState;
  onToggleVisibility: () => void;
  sectionOrder: string[];
  visible: boolean;
}

export const PrioritySection: FC<PrioritySectionProps> = ({ classes, sectionOrder, thought, priorityOptions, onEdit, sectionState, onToggleVisibility, visible = true }) => {

  return (
    <ThoughtSection
      classes={classes}
      sectionOrder={sectionOrder}
      section={'priority'}
      Icon={LowPriority}
      field={'Priority'}
      value={priorityOptions.find(({ value }) => value === thought.priority).label}
      className={'priority'}
      visible={visible}
      quickActionButton={thought.priority !== 10 && (
        <button className={classes.highPriorityButton} onClick={() => onEdit(10)}><PriorityHighRounded/></button>
      )}
      sectionState={sectionState}
      onToggleVisibility={onToggleVisibility}
      edit={{
        type: EditTypes.Select,
        options: priorityOptions.map(({ label }) => label),
        onEdit: value => onEdit(priorityOptions.find(({ label }) => label === value).value),
      }}
    />
  );
};

export default PrioritySection;
