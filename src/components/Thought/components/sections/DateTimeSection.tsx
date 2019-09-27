import React, { FC } from 'react';
import ThoughtSection from './ThoughtSection';
import CalendarToday from '@material-ui/icons/CalendarToday';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { EditTypes } from '../../types';

interface DateTimeSectionProps {
  classes: any;
  thought: Thought;
  onEdit: (value: number) => void;
}

export const DateTimeSection: FC<DateTimeSectionProps> = ({ classes, thought, onEdit }) => {
  const dateTimeText = `${thought.date},${thought.time}`;

  return (
    <ThoughtSection
      classes={classes}
      Icon={CalendarToday}
      field={'Date/Time'}
      value={dateTimeText}
      className={'datetime'}
      visible={true}
      edit={{
        type: EditTypes.DateTime,
        onEdit,
        onChangeVisibility: console.log,
      }}
    />
  );
};

export default DateTimeSection;
