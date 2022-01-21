import React, { FC, memo, useMemo, useRef, useState } from 'react';
import Close from '@material-ui/icons/Close';
import { getTime } from './util';
import {
  connections as connectionsActions,
  notes as noteActions,
  statuses as statusActions,
  tags as tagActions,
  thoughts as thoughtActions,
} from '../../actions';
import { createWholeThought } from '../../actions/complex';
import { useLoadedDB } from '../../hooks/useDB';
import { useNavigate } from 'react-router-dom';
import { useHomeUrl } from '../../lib/util';
import { useThoughtInformationStyles } from './styles';
import { PriorityOption } from './';
import { Thought } from 'store/rxdb/schemas/thought';
import { Picture } from 'store/rxdb/schemas/picture';
import { Tag } from 'store/rxdb/schemas/tag';
import { Plan } from 'store/rxdb/schemas/plan';
import { Note as NoteType } from 'store/rxdb/schemas/note';
import { Status as StatusType } from 'store/rxdb/schemas/status';
import { ConnectionSummary } from './';
import TypeSection from './components/sections/TypeSection';
import StatusSection from './components/sections/StatusSection';
import PrioritySection from './components/sections/PrioritySection';
import DescriptionSection from './components/sections/DescriptionSection';
import DateTimeSection from './components/sections/DateTimeSection';
import NotesSection from './components/sections/NotesSection';
import TagsSection from './components/sections/TagsSection';
import ConnectionsSection from './components/sections/ConnectionsSection';
import ThoughtTitle from './components/sections/ThoughtTitle';
import PicturesSection from './components/sections/PicturesSection';
import RecurringSection from './components/sections/RecurringSection';
import CircleButton from '../General/CircleButton';
import { ComponentMap, SectionState, SectionVisibility } from './types';
import {
  generateNextSectionsAfterMove,
  generateNextSectionsAfterToggleVisibility,
} from './util';
import useGoogleCalendar, {
  Actions,
  GoogleCalendarEvent,
} from '../../hooks/useGoogleCalendar';
import {
  generateDescriptionFromThought,
  generateEndFromThought,
  generateRemindersFromThought,
  generateStartFromThought,
} from '../ThoughtSettings/components/Calendar/lib/util';
import { Bookmark } from '@material-ui/icons';
import classNames from 'classnames';
import { format } from 'date-fns';

const DASH_REGEX = /-/g;

export interface ThoughtInformationProps {
  thought: Thought;
  tags: Tag[];
  notes: NoteType[];
  statusOptions: string[];
  typeOptions: string[];
  tagOptions: string[];
  priorityOptions: PriorityOption[];
  onUpdate: (thought: Thought) => void;
  statuses: StatusType[];
  pinnedPictures: Picture[];
  connections: ConnectionSummary[];
  plan: Plan;
  sectionOrder: string[];
  sectionVisibility: SectionVisibility;
  cancelEditAllSections: () => void;
  editAllSections: boolean;
  autoCreateCalendarEvent: boolean;
}

const ThoughtInformation: FC<ThoughtInformationProps> = ({
  thought,
  tags = [],
  notes = [],
  statusOptions = [],
  typeOptions = [],
  tagOptions = [],
  priorityOptions = [],
  onUpdate,
  statuses,
  pinnedPictures,
  connections = [],
  plan,
  sectionOrder,
  sectionVisibility,
  cancelEditAllSections,
  editAllSections,
  autoCreateCalendarEvent,
}) => {
  const classes = useThoughtInformationStyles();
  const lastSectionOrder = useRef<string[]>(null);
  const handleMoveCB = useRef<() => void>(null);
  const sectionsWrapper = useRef<HTMLDivElement>(null);
  lastSectionOrder.current = sectionOrder;
  const lastSectionVisibility = useRef<SectionVisibility>(null);
  lastSectionVisibility.current = sectionVisibility;
  const { db } = useLoadedDB();
  const navigate = useNavigate();
  const homeUrl = useHomeUrl();
  const [editingSection, setEditingSection] = useState<string>(null);
  const [createdText, lastUpdatedText]: [string, string] = useMemo(() => {
    if (statuses && statuses.length > 0) {
      return [
        getTime(statuses[statuses.length - 1].updated),
        getTime(statuses[0].created),
      ];
    }

    return [getTime(thought.created), getTime(thought.updated)];
  }, [thought, statuses]);

  const [signedIn, actions]: [boolean, Actions, any] = useGoogleCalendar(
    autoCreateCalendarEvent
  );

  const handleEditThought = (field: string) => (value: any) => {
    onUpdate({
      ...thought,
      [field]: value,
    });
  };

  const handleEditStatus = (value: string) => {
    statusActions.createStatus(db, {
      text: value,
      thoughtId: thought.id,
    });
  };

  const handleEditDateTime = async (datetime: any) => {
    const [date, time] = datetime.split(',');
    const nextThought: Thought = {
      ...thought,
      date: date || '',
      time: time || '',
    };

    if (signedIn && autoCreateCalendarEvent && !thought.calendarLink) {
      const gogleCalendarEvent: GoogleCalendarEvent = {
        kind: 'calendar#event',
        id: nextThought.id.replace(DASH_REGEX, ''),
        status: 'confirmed',
        summary: nextThought.title,
        description: generateDescriptionFromThought(nextThought),
        start: generateStartFromThought(nextThought),
        end: generateEndFromThought(nextThought),
        reminders: generateRemindersFromThought(),
      };

      const event: any = await Promise.race([
        new Promise((resolve) => setTimeout(() => resolve(null), 5000)),
        new Promise((resolve) =>
          actions
            .createEvent(gogleCalendarEvent)
            .then(resolve)
            .catch(() => resolve(null))
        ),
      ]);
      onUpdate({
        ...nextThought,
        calendarLink: event?.result?.htmlLink ?? '',
      });
    } else {
      onUpdate(nextThought);
    }
  };

  const handleEditNote = (idx: number, value: string) => {
    noteActions.editNote(db, {
      ...notes[idx],
      text: value,
    });
  };

  const handleCreateNote = (value: string) => {
    noteActions.createNote(db, {
      thoughtId: thought.id,
      text: value,
    });
  };

  const handleDeleteNote = (idx: number) => {
    noteActions.deleteNote(db, notes[idx].id);
  };

  const handleDeleteTag = (idx: number) => {
    tagActions.deleteTag(db, tags[idx].id);
  };

  const handleCreateTag = (value: string) => {
    tagActions.createTag(db, {
      thoughtId: thought.id,
      text: value,
    });
  };

  const handleCreateConnection = async (value: string) => {
    const createdThought = await createWholeThought(
      db,
      {
        title: value,
        type: (plan && plan.defaultType) || 'Task',
        date: '',
        time: '',
        description: '',
        notes: [],
        tags: [],
      },
      thought.planId
    );

    connectionsActions.createConnection(db, {
      from: thought.id,
      to: createdThought.thought.id,
    });

    navigate(`${homeUrl}thought/${createdThought.thought.id}`);
  };

  const remainingTagOptions = tagOptions.filter(
    (value) => !tags.find(({ text }) => text === value)
  );

  const deriveSectionState = (sectionType: string): SectionState => {
    if (editingSection === sectionType) {
      return SectionState.EditingSection;
    } else if (editingSection) {
      return SectionState.EditingOtherSection;
    } else if (editAllSections === true) {
      return SectionState.EditingEverySection;
    }

    return SectionState.NotEditingAnySection;
  };

  const handleLongPress = (sectionType: string) => (onMoveCB: () => void) => {
    setEditingSection(sectionType);
    handleMoveCB.current = onMoveCB;
  };

  const handleDrop = (sectionType: string) => async () => {
    const nextSections = generateNextSectionsAfterMove(
      lastSectionOrder,
      lastSectionVisibility,
      editingSection,
      sectionType
    );
    await thoughtActions.editThought(db, {
      ...thought,
      sections: nextSections,
    });
    setEditingSection(null);
    if (handleMoveCB.current) {
      handleMoveCB.current();
      handleMoveCB.current = null;
    }
  };

  const handleToggleVisibility = (sectionType: string) => async () => {
    const nextSections = generateNextSectionsAfterToggleVisibility(
      lastSectionOrder,
      lastSectionVisibility,
      sectionType
    );
    await thoughtActions.editThought(db, {
      ...thought,
      sections: nextSections,
    });
  };

  const handleCancelEditSection = () => {
    setEditingSection(null);
    cancelEditAllSections();
  };

  const handleClickRoot = (e: any) => {
    if (!e.target.closest('SECTION') && (editAllSections || editingSection)) {
      handleCancelEditSection();
    }
  };

  const handleToggleStaged = () => {
    thoughtActions.editThought(db, {
      ...thought,
      stagedOn: thought.stagedOn ? '' : format(new Date(), 'yyyy-MM-dd')
    });
  };

  const components: ComponentMap = {
    type: (
      <TypeSection
        key={'type'}
        classes={classes}
        thought={thought}
        typeOptions={typeOptions}
        visible={sectionVisibility['type']}
        onEdit={handleEditThought('type')}
        sectionState={deriveSectionState('type')}
        onLongPress={handleLongPress('type')}
        onDrop={handleDrop('type')}
        onToggleVisibility={handleToggleVisibility('type')}
      />
    ),
    status: (
      <StatusSection
        key={'status'}
        classes={classes}
        thought={thought}
        statusOptions={statusOptions}
        onEdit={handleEditStatus}
        visible={sectionVisibility['status']}
        sectionState={deriveSectionState('status')}
        onLongPress={handleLongPress('status')}
        onDrop={handleDrop('status')}
        onToggleVisibility={handleToggleVisibility('status')}
      />
    ),
    priority: (
      <PrioritySection
        key={'priority'}
        classes={classes}
        thought={thought}
        visible={sectionVisibility['priority']}
        priorityOptions={priorityOptions}
        onEdit={handleEditThought('priority')}
        sectionState={deriveSectionState('priority')}
        onLongPress={handleLongPress('priority')}
        onDrop={handleDrop('priority')}
        onToggleVisibility={handleToggleVisibility('priority')}
      />
    ),
    description: (
      <DescriptionSection
        key={'description'}
        classes={classes}
        thought={thought}
        visible={sectionVisibility['description']}
        onEdit={handleEditThought('description')}
        sectionState={deriveSectionState('description')}
        onLongPress={handleLongPress('description')}
        onDrop={handleDrop('description')}
        onToggleVisibility={handleToggleVisibility('description')}
      />
    ),
    datetime: (
      <DateTimeSection
        key={'datetime'}
        classes={classes}
        thought={thought}
        visible={sectionVisibility['datetime']}
        onEdit={handleEditDateTime}
        sectionState={deriveSectionState('datetime')}
        onLongPress={handleLongPress('datetime')}
        onDrop={handleDrop('datetime')}
        onToggleVisibility={handleToggleVisibility('datetime')}
      />
    ),
    notes: (
      <NotesSection
        key={'notes'}
        classes={classes}
        notes={notes}
        visible={sectionVisibility['notes']}
        onEdit={handleEditNote}
        onCreate={handleCreateNote}
        onDelete={handleDeleteNote}
        sectionState={deriveSectionState('notes')}
        onLongPress={handleLongPress('notes')}
        onDrop={handleDrop('notes')}
        onToggleVisibility={handleToggleVisibility('notes')}
      />
    ),
    recurring: (
      <RecurringSection
        key={'recurring'}
        classes={classes}
        thought={thought}
        visible={sectionVisibility['recurring']}
        onEdit={handleEditThought('recurring')}
        sectionState={deriveSectionState('recurring')}
        onLongPress={handleLongPress('recurring')}
        onDrop={handleDrop('recurring')}
        onToggleVisibility={handleToggleVisibility('recurring')}
      />
    ),
    tags: (
      <TagsSection
        key={'tags'}
        classes={classes}
        tags={tags}
        visible={sectionVisibility['tags']}
        onDelete={handleDeleteTag}
        onCreate={handleCreateTag}
        tagOptions={remainingTagOptions}
        sectionState={deriveSectionState('tags')}
        onLongPress={handleLongPress('tags')}
        onDrop={handleDrop('tags')}
        onToggleVisibility={handleToggleVisibility('tags')}
      />
    ),
    connections: (
      <ConnectionsSection
        key={'connections'}
        classes={classes}
        thoughtId={thought.id}
        visible={sectionVisibility['connections']}
        onCreate={handleCreateConnection}
        connections={connections}
        sectionState={deriveSectionState('connections')}
        onLongPress={handleLongPress('connections')}
        onDrop={handleDrop('connections')}
        onToggleVisibility={handleToggleVisibility('connections')}
      />
    ),
    pictures: (
      <PicturesSection
        key={'pictures'}
        classes={classes}
        thought={thought}
        visible={sectionVisibility['pictures']}
        pinnedPictures={pinnedPictures}
        sectionState={deriveSectionState('pictures')}
        onLongPress={handleLongPress('pictures')}
        onDrop={handleDrop('pictures')}
        onToggleVisibility={handleToggleVisibility('pictures')}
      />
    ),
  };

  return (
    <div className={classes.root} onClick={handleClickRoot}>
      {(editAllSections || editingSection) && (
        <CircleButton
          classes={classes}
          id={'cancel-edit'}
          onClick={handleCancelEditSection}
          label={'Cancel Edit'}
          Icon={Close}
        />
      )}
      <ThoughtTitle classes={classes} thought={thought} onUpdate={onUpdate} />
      {thought.status !== 'completed' && (<button
        onClick={handleToggleStaged}
        className={classNames(classes.stageButton, {
          staged: Boolean(thought.stagedOn),
        })}>
        <Bookmark/>
      </button>)}
      <span className={classes.createdAt}>Created {createdText}</span>
      <span className={classes.updatedAt}>Updated {lastUpdatedText}</span>
      {plan && <span className={classes.planName}>{plan.name}</span>}
      <div ref={sectionsWrapper} className={classes.thoughtSections}>
        {sectionOrder.map((section) => {
          return components[section];
        })}
      </div>
    </div>
  );
};

export default memo(ThoughtInformation);
