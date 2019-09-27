import React, { FC } from 'react';
import ThoughtSection from './ThoughtSection';
import Autorenew from '@material-ui/icons/Autorenew';
import Check from '@material-ui/icons/Check';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { EditTypes } from '../../types';
import classNames from 'classnames';

interface RecurringSectionProps {
  classes: any;
  thought: Thought;
  onEdit: (value: number) => void;
}

export const RecurringSection: FC<RecurringSectionProps> = ({ classes, thought, onEdit }) => {

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
      visible={true}
      edit={{
        type: EditTypes.Number,
        onEdit: handleEdit,
        onChangeVisibility: console.log,
      }}
    />
  );
};

export default RecurringSection;
