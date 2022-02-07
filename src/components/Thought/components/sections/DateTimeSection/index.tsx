import React, { FC } from 'react';
import ThoughtSection from '../ThoughtSection';
import Add from '@material-ui/icons/Add';
import CalendarToday from '@material-ui/icons/CalendarToday';
import { Thought } from '../../../../../store/rxdb/schemas/thought';
import { EditTypes, SectionState } from '../../../types';
import { Note, Tag } from '../../../../../store/rxdb/schemas/types';
import { generateICS } from './util';

interface DateTimeSectionProps {
  classes: any;
  thought: Thought;
  onEdit: (value: number) => void;
  sectionState: SectionState;
  onToggleVisibility: () => void;
  sectionOrder: string[];
  visible: boolean;
  tags: Tag[];
  notes: Note[];
}



export const DateTimeSection: FC<DateTimeSectionProps> = ({
  classes,
  sectionOrder,
  thought,
  onEdit,
  sectionState,
  onToggleVisibility,
  tags,
  notes,
  visible = true,
}) => {
  const dateTimeText = `${thought.date},${thought.time}`;

  const handleDownloadICS = (thought: Thought) => {
    return generateICS(thought, tags, notes);
  };

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
      quickActionButton={thought.date && (
        <button className={classes.addToCalendaryButton} onClick={() => handleDownloadICS(thought)}><Add/></button>
      )}
      edit={{
        type: EditTypes.DateTime,
        onEdit,
      }}
    />
  );
};

export default DateTimeSection;
