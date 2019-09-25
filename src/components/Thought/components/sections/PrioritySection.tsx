import React, { FC } from 'react';
import ThoughtSection from './ThoughtSection';
import LowPriority from '@material-ui/icons/LowPriority';
import PriorityHighRounded from '@material-ui/icons/PriorityHighRounded';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { EditTypes } from '../../types';
import { PriorityOption } from '../../';

interface PrioritySectionProps {
  classes: any;
  thought: Thought;
  priorityOptions: PriorityOption[];
  onEdit: (value: number) => void;
}

export const PrioritySection: FC<PrioritySectionProps> = ({ classes, thought, priorityOptions, onEdit }) => {

  return (
    <ThoughtSection
      classes={classes}
      Icon={LowPriority}
      field={'Priority'}
      value={priorityOptions.find(({ value }) => value === thought.priority).label}
      className={'priority'}
      visible={true}
      quickActionButton={thought.priority !== 10 && (
        <button className={classes.highPriorityButton} onClick={() => onEdit(10)}><PriorityHighRounded/></button>
      )}
      edit={{
        type: EditTypes.Select,
        options: priorityOptions.map(({ label }) => label),
        onEdit: value => onEdit(priorityOptions.find(({ label }) => label === value).value),
        onChangeVisibility: console.log,
      }}
    />
  );
};

export default PrioritySection;
