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
  onToggleVisibility: () => void;
  sectionOrder: string[];
  visible: boolean;
}

export const DateTimeSection: FC<DateTimeSectionProps> = ({ classes, sectionOrder, thought, onEdit, sectionState, onToggleVisibility, visible = true }) => {
  const dateTimeText = `${thought.date},${thought.time}`;

  return (
    <ThoughtSection
      classes={classes}
      sectionOrder={sectionOrder}
      section={'datetime'}
      Icon={CalendarToday}
      field={'Date/Time'}
      value={dateTimeText}
      className={'datetime'}
      visible={visible}
      sectionState={sectionState}
      onToggleVisibility={onToggleVisibility}
      edit={{
        type: EditTypes.DateTime,
        onEdit,
      }}
    />
  );
};

export default DateTimeSection;
