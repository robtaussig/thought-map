import React, { useMemo, FC, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import { getTime } from './util';
import {
  notes as noteActions,
  tags as tagActions,
  statuses as statusActions,
  connections as connectionsActions,
  thoughts as thoughtActions,
} from '../../actions';
import { createWholeThought } from '../../actions/complex';
import { useLoadedDB } from '../../hooks/useDB';
import useApp from '../../hooks/useApp';
import { homeUrl } from '../../lib/util';
import { thoughtInformationStyles } from './styles';
import { PriorityOption } from './'
import { Settings } from 'reducers';
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
import { SectionState } from './types';

export interface ThoughtInformationProps {
  classes: any;
  thought: Thought;
  tags: Tag[];
  notes: NoteType[];
  statusOptions: string[];
  typeOptions: string[];
  tagOptions: string[];
  priorityOptions: PriorityOption[];
  onUpdate: (thought: Thought) => void;
  stateSettings: Settings;
  statuses: StatusType[];
  pinnedPictures: Picture[];
  connections: ConnectionSummary[];
  plan: Plan;
}

export const ThoughtInformation: FC<ThoughtInformationProps> = React.memo(({
  classes,
  thought,
  tags = [],
  notes = [],
  statusOptions = [],
  typeOptions = [],
  tagOptions = [],
  priorityOptions = [],
  onUpdate,
  stateSettings,
  statuses,
  pinnedPictures,
  connections = [],
  plan,
}) => {
  const db = useLoadedDB();
  const { history } = useApp();
  const [editingSection, setEditingSection] = useState<string>(null);
  const [createdText, lastUpdatedText]: [string, string] = useMemo(() => {
    if (statuses && statuses.length > 0) {
      return [getTime(statuses[statuses.length - 1].updated), getTime(statuses[0].created)];
    }

    return [getTime(thought.created), getTime(thought.updated)];
  }, [thought, statuses]);

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

  const handleEditDateTime = (datetime: any) => {
    const [date, time] = datetime.split(',');
    onUpdate({
      ...thought,
      date: date || '',
      time: time || '',
    });
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
    const createdThought = await createWholeThought(db, {
      title: value,
      type: plan && plan.defaultType || 'Task',
      date: '',
      time: '',
      description: '',
      notes: [],
      tags: [],
    }, thought.planId);

    await connectionsActions.createConnection(db, {
      from: thought.id,
      to: createdThought.thought.id,
    });
    
    history.push(`${homeUrl(history)}thought/${createdThought.thought.id}`);
  };

  const remainingTagOptions = tagOptions.filter(value => !tags.find(({ text }) => text === value));

  const deriveSectionState = (sectionType: string): SectionState => {

    if (editingSection === sectionType) {
      return SectionState.EditingSection;
    } else if (editingSection) {
      return SectionState.EditingOtherSection;
    }

    return SectionState.NotEditingAnySection;
  };

  const handleLongPress = (sectionType: string) => () => {
    setEditingSection(sectionType);
  };

  const handleDrop = (sectionType: string) => () => {
    console.log(sectionType);
    setEditingSection(null);
  };

  const handleToggleVisibility = (sectionType: string) => () => {
    console.log(sectionType);
  };

  return (
    <div className={classes.root}>
      {editingSection && <CircleButton classes={classes} id={'cancel-edit'} onClick={() => setEditingSection(null)} label={'Cancel Edit'} Icon={Close}/>}
      <ThoughtTitle
        classes={classes}
        thought={thought}
        onUpdate={onUpdate}
      />
      <span className={classes.createdAt}>Created {createdText}</span>
      <span className={classes.updatedAt}>Updated {lastUpdatedText}</span>
      {plan && <span className={classes.planName}>{plan.name}</span>}
      <div className={classes.thoughtSections}>
        <TypeSection
          classes={classes}
          thought={thought}
          typeOptions={typeOptions}
          onEdit={handleEditThought('type')}
          sectionState={deriveSectionState('type')}
          onLongPress={handleLongPress('type')}
          onDrop={handleDrop('type')}
          onToggleVisibility={handleToggleVisibility('type')}
        />
        <StatusSection
          classes={classes}
          thought={thought}
          statusOptions={statusOptions}
          onEdit={handleEditStatus}
          sectionState={deriveSectionState('status')}
          onLongPress={handleLongPress('status')}
          onDrop={handleDrop('status')}
          onToggleVisibility={handleToggleVisibility('status')}
        />
        <PrioritySection
          classes={classes}
          thought={thought}
          priorityOptions={priorityOptions}
          onEdit={handleEditThought('priority')}
          sectionState={deriveSectionState('priority')}
          onLongPress={handleLongPress('priority')}
          onDrop={handleDrop('priority')}
          onToggleVisibility={handleToggleVisibility('priority')}
        />
        <DescriptionSection
          classes={classes}
          thought={thought}
          onEdit={handleEditThought('description')}
          sectionState={deriveSectionState('description')}
          onLongPress={handleLongPress('description')}
          onDrop={handleDrop('description')}
          onToggleVisibility={handleToggleVisibility('description')}
        />
        <DateTimeSection
          classes={classes}
          thought={thought}
          onEdit={handleEditDateTime}
          sectionState={deriveSectionState('datetime')}
          onLongPress={handleLongPress('datetime')}
          onDrop={handleDrop('datetime')}
          onToggleVisibility={handleToggleVisibility('datetime')}
        />
        <NotesSection
          classes={classes}
          notes={notes}
          onEdit={handleEditNote}
          onCreate={handleCreateNote}
          onDelete={handleDeleteNote}
          sectionState={deriveSectionState('notes')}
          onLongPress={handleLongPress('notes')}
          onDrop={handleDrop('notes')}
          onToggleVisibility={handleToggleVisibility('notes')}
        />
        <RecurringSection
          classes={classes}
          thought={thought}
          onEdit={handleEditThought('recurring')}
          sectionState={deriveSectionState('recurring')}
          onLongPress={handleLongPress('recurring')}
          onDrop={handleDrop('recurring')}
          onToggleVisibility={handleToggleVisibility('recurring')}
        />
        <TagsSection
          classes={classes}
          tags={tags}
          onDelete={handleDeleteTag}
          onCreate={handleCreateTag}
          tagOptions={remainingTagOptions}
          sectionState={deriveSectionState('tags')}
          onLongPress={handleLongPress('tags')}
          onDrop={handleDrop('tags')}
          onToggleVisibility={handleToggleVisibility('tags')}
        />
        <ConnectionsSection 
          classes={classes}
          thoughtId={thought.id}
          onCreate={handleCreateConnection}
          connections={connections}
          sectionState={deriveSectionState('connections')}
          onLongPress={handleLongPress('connections')}
          onDrop={handleDrop('connections')}
          onToggleVisibility={handleToggleVisibility('connections')}
        />
        <PicturesSection
          classes={classes}
          thought={thought}
          pinnedPictures={pinnedPictures}
          sectionState={deriveSectionState('pictures')}
          onLongPress={handleLongPress('pictures')}
          onDrop={handleDrop('pictures')}
          onToggleVisibility={handleToggleVisibility('pictures')}
        />
      </div>
    </div>
  )
});

export default withStyles(thoughtInformationStyles)(ThoughtInformation);
