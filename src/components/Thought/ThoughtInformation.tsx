import React, { FC, memo, useMemo, useState } from 'react';
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
  generateNextSectionsAfterToggleVisibility,
} from './util';


import { Bookmark } from '@material-ui/icons';
import classNames from 'classnames';
import { format } from 'date-fns';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import LocationSection from './components/sections/LocationSection';

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
}) => {
  const classes = useThoughtInformationStyles();
  const [localSectionOrder, setLocalSectionOrder] = useState(sectionOrder);
  const { db } = useLoadedDB();
  const navigate = useNavigate();
  const homeUrl = useHomeUrl();
  const [editingSection, setEditingSection] = useState<string>(null);
  const [createdText, lastUpdatedText]: [string, string] = useMemo(() => {
    if (statuses?.length > 0) {
      return [
        getTime(statuses[statuses.length - 1].updated),
        getTime(statuses[0].created),
      ];
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

  const handleEditDateTime = async (datetime: any) => {
    const [date, time] = datetime.split(',');
    const nextThought: Thought = {
      ...thought,
      date: date || '',
      time: time || '',
    };

    onUpdate(nextThought);
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

  const onDragStart = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  };

  const visibleSectionOrder = localSectionOrder.filter(section => (
    sectionVisibility[section]
  ));

  const onDragEnd = (result: DropResult) => {
    if (!result.destination.droppableId) return;

    const newVisibleSectionOrder = [...visibleSectionOrder];
    const invisibleSectionOrder = localSectionOrder.filter(section => (
      visibleSectionOrder.indexOf(section) === -1
    ));

    const from = result.source.index;
    const to = result.destination.index;

    const [removed] = newVisibleSectionOrder.splice(from, 1);
    newVisibleSectionOrder.splice(to, 0, removed);

    setLocalSectionOrder(
      newVisibleSectionOrder.concat(invisibleSectionOrder)
    );

    thoughtActions.editThought(db, {
      ...thought,
      sections: newVisibleSectionOrder
        .concat(invisibleSectionOrder.map(section => `_${section}`))
        .join('-'),
    });
  };

  const handleToggleVisibility = (sectionType: string) => async () => {
    const nextSections = generateNextSectionsAfterToggleVisibility(
      localSectionOrder,
      sectionVisibility,
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
        sectionOrder={visibleSectionOrder}
        classes={classes}
        thought={thought}
        typeOptions={typeOptions}
        visible={sectionVisibility['type']}
        onEdit={handleEditThought('type')}
        sectionState={deriveSectionState('type')}        
        onToggleVisibility={handleToggleVisibility('type')}
      />
    ),
    status: (
      <StatusSection
        key={'status'}
        sectionOrder={visibleSectionOrder}
        classes={classes}
        thought={thought}
        statusOptions={statusOptions}
        onEdit={handleEditStatus}
        visible={sectionVisibility['status']}
        sectionState={deriveSectionState('status')}        
        onToggleVisibility={handleToggleVisibility('status')}
      />
    ),
    priority: (
      <PrioritySection
        key={'priority'}
        sectionOrder={visibleSectionOrder}
        classes={classes}
        thought={thought}
        visible={sectionVisibility['priority']}
        priorityOptions={priorityOptions}
        onEdit={handleEditThought('priority')}
        sectionState={deriveSectionState('priority')}        
        onToggleVisibility={handleToggleVisibility('priority')}
      />
    ),
    description: (
      <DescriptionSection
        key={'description'}
        sectionOrder={visibleSectionOrder}
        classes={classes}
        thought={thought}
        visible={sectionVisibility['description']}
        onEdit={handleEditThought('description')}
        sectionState={deriveSectionState('description')}        
        onToggleVisibility={handleToggleVisibility('description')}
      />
    ),
    datetime: (
      <DateTimeSection
        key={'datetime'}
        sectionOrder={visibleSectionOrder}
        classes={classes}
        thought={thought}
        tags={tags}
        notes={notes}
        visible={sectionVisibility['datetime']}
        onEdit={handleEditDateTime}
        sectionState={deriveSectionState('datetime')}        
        onToggleVisibility={handleToggleVisibility('datetime')}
      />
    ),
    notes: (
      <NotesSection
        key={'notes'}
        sectionOrder={visibleSectionOrder}
        classes={classes}
        notes={notes}
        visible={sectionVisibility['notes']}
        onEdit={handleEditNote}
        onCreate={handleCreateNote}
        onDelete={handleDeleteNote}
        sectionState={deriveSectionState('notes')}        
        onToggleVisibility={handleToggleVisibility('notes')}
      />
    ),
    recurring: (
      <RecurringSection
        key={'recurring'}
        sectionOrder={visibleSectionOrder}
        classes={classes}
        thought={thought}
        visible={sectionVisibility['recurring']}
        onEdit={handleEditThought('recurring')}
        sectionState={deriveSectionState('recurring')}        
        onToggleVisibility={handleToggleVisibility('recurring')}
      />
    ),
    tags: (
      <TagsSection
        key={'tags'}
        sectionOrder={visibleSectionOrder}
        classes={classes}
        tags={tags}
        visible={sectionVisibility['tags']}
        onDelete={handleDeleteTag}
        onCreate={handleCreateTag}
        tagOptions={remainingTagOptions}
        sectionState={deriveSectionState('tags')}        
        onToggleVisibility={handleToggleVisibility('tags')}
      />
    ),
    connections: (
      <ConnectionsSection
        key={'connections'}
        sectionOrder={visibleSectionOrder}
        classes={classes}
        thoughtId={thought.id}
        visible={sectionVisibility['connections']}
        onCreate={handleCreateConnection}
        connections={connections}
        sectionState={deriveSectionState('connections')}        
        onToggleVisibility={handleToggleVisibility('connections')}
      />
    ),
    pictures: (
      <PicturesSection
        key={'pictures'}
        sectionOrder={visibleSectionOrder}
        classes={classes}
        thought={thought}
        visible={sectionVisibility['pictures']}
        pinnedPictures={pinnedPictures}
        sectionState={deriveSectionState('pictures')}        
        onToggleVisibility={handleToggleVisibility('pictures')}
      />
    ),
    location: (
      <LocationSection
        key={'location'}
        sectionOrder={visibleSectionOrder}
        classes={classes}
        thought={thought}
        visible={sectionVisibility['location']}
        onEdit={handleEditThought('location')}
        sectionState={deriveSectionState('location')}        
        onToggleVisibility={handleToggleVisibility('location')}
      />
    )
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
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable droppableId="active">
          {(provided, snapshot) => (
            <div 
              className={classes.thoughtSections}
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {localSectionOrder.map((section) => {
                return components[section];
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

const getListStyle = (isDraggingOver: boolean) => ({
  opacity: isDraggingOver ? 0.8 : undefined,
  padding: 8,
});

export default memo(ThoughtInformation);
