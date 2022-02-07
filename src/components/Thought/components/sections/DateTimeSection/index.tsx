import React, { FC } from 'react';
import ThoughtSection from '../ThoughtSection';
import CalendarToday from '@material-ui/icons/CalendarToday';
import { Thought } from '../../../../../store/rxdb/schemas/thought';
import { EditTypes, SectionState } from '../../../types';
import { Note, Tag } from '../../../../../store/rxdb/schemas/types';
import { generateICS } from './util';
import { thoughts as thoughtActions } from '../../../../../actions';
import { useLoadedDB } from '../../../../../hooks/useDB';

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
  const { db } = useLoadedDB();
  const handleDownloadICS = async () => {
    await generateICS({ thought, tags, notes });
    thoughtActions.editThought(db, {
      ...thought,
      lastIcsCalendarSequence: thought.lastIcsCalendarSequence + 1,
    });
  };

  const handleCancelICS = () => {
    return generateICS({ thought, tags, notes, isCancel: true });
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
        <div className={classes.calendarButtons}>
          <button className={classes.addToCalendarButton} onClick={handleDownloadICS}>
            {thought.lastIcsCalendarSequence === -1 ? 'Save to calendar' : 'Update'}
          </button>
          {thought.lastIcsCalendarSequence >= 0 && (<button className={classes.addToCalendarButton} onClick={handleCancelICS}>Cancel</button>)}
        </div>
      )}
      edit={{
        type: EditTypes.DateTime,
        onEdit,
      }}
    />
  );
};

export default DateTimeSection;
