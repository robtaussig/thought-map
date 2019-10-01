import React, { FC } from 'react';
import ThoughtSection from './ThoughtSection';
import CalendarToday from '@material-ui/icons/CalendarToday';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { EditTypes, SectionState } from '../../types';

interface DateTimeSectionProps {
  classes: any;
  thought: Thought;
  onEdit: (value: number) => void;
  sectionState: SectionState;
  onLongPress: (e: any) => void;
  onDrop: () => void;
  onToggleVisibility: () => void;
  
}

export const DateTimeSection: FC<DateTimeSectionProps> = ({ classes, thought, onEdit, sectionState, onLongPress, onDrop, onToggleVisibility }) => {
  const dateTimeText = `${thought.date},${thought.time}`;

  return (
    <ThoughtSection
      classes={classes}
      Icon={CalendarToday}
      field={'Date/Time'}
      value={dateTimeText}
      className={'datetime'}
      visible={true}
      sectionState={sectionState}
      onLongPress={onLongPress}
      onDrop={onDrop}
      onToggleVisibility={onToggleVisibility}
      edit={{
        type: EditTypes.DateTime,
        onEdit,
        onChangeVisibility: console.log,
      }}
    />
  );
};

export default DateTimeSection;
