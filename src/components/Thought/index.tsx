import React, { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useLoadedDB } from '../../hooks/useDB';
import { useThoughtHomeStyles } from './styles';
import Loading from '../Loading';
import ThoughtInformation from './ThoughtInformation';
import MissingThought from './components/MissingThought';
import ThoughtSettings from '../ThoughtSettings';
import { plans as planActions, thoughts as thoughtActions } from '../../actions';
import { useIdFromUrl } from '../../lib/util';
import { Picture } from '../../store/rxdb/schemas/picture';
import { Thought as ThoughtType } from '~store/rxdb/schemas/types';
import { SectionVisibility } from './types';
import { thoughtSelector } from '../../reducers/thoughts';
import { tagSelector } from '../../reducers/tags';
import { noteSelector } from '../../reducers/notes';
import { displayThoughtSettingsSelector, toggle } from '../../reducers/displayThoughtSettings';
import { connectionSelector } from '../../reducers/connections';
import { planSelector } from '../../reducers/plans';
import { statusesByThoughtSelector } from '../../reducers/statusesByThought';
import { statusSelector } from '../../reducers/statuses';
import { pictureSelector } from '../../reducers/pictures';
import { useDispatch, useSelector } from 'react-redux';

export interface PriorityOption {
  value: number;
  label: string;
}

export interface ConnectionSummary {
  isParent: boolean;
  otherThought: ThoughtType;
  connectionId: string;
}

interface ThoughtProps {
  statusOptions: string[];
  typeOptions: string[];
  tagOptions: string[];
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 0, label: 'NOT RELEVANT (HIDE)' },
  { value: 1, label: 'LOW (1)' },
  { value: 2, label: 'LOW (2)' },
  { value: 3, label: 'LOW (3)' },
  { value: 4, label: 'LOW (4)' },
  { value: 5, label: 'MEDIUM (5)' },
  { value: 6, label: 'MEDIUM (6)' },
  { value: 7, label: 'MEDIUM (7)' },
  { value: 8, label: 'HIGH (8)' },
  { value: 9, label: 'HIGH (9)' },
  { value: 10, label: 'HIGH (10)' },
];

const SECTION_DELIMITER_REGEX = /^_/;

export const DEFAULT_SECTIONS = 'type-status-connections-priority-description-datetime-notes-recurring-tags-pictures';

export const Thought: FC<ThoughtProps> = ({ statusOptions, typeOptions, tagOptions }) => {
  const { db } = useLoadedDB();
  const classes = useThoughtHomeStyles();
  const dispatch = useDispatch();
  const displayThoughtSettings = useSelector(displayThoughtSettingsSelector);
  const [editAllSections, setEditAllSections] = useState<boolean>(false);
  const [threeSecondsElapsed, setThreeSecondsElapsed] = useState<boolean>(false);
  const thoughtId = useIdFromUrl('thought');
  const thoughts = useSelector(thoughtSelector);
  const tags = useSelector(tagSelector);
  const notes = useSelector(noteSelector);
  const connections = useSelector(connectionSelector);
  const plans = useSelector(planSelector);
  const statusesByThought = useSelector(statusesByThoughtSelector);
  const statuses = useSelector(statusSelector);
  const pictures = useSelector(pictureSelector);
  const setDisplaySettings = (display: boolean) => dispatch(toggle(display));

  const thought = useMemo(() => thoughts.find(thought => thought.id === thoughtId), [thoughtId, thoughts]);
  const relatedTags = useMemo(() => Object.values(tags).filter(tag => tag.thoughtId === thoughtId), [thoughtId, tags]);
  const relatedNotes = useMemo(() => Object.values(notes).filter(note => note.thoughtId === thoughtId), [thoughtId, notes]);
  const relatedConnections: ConnectionSummary[] = useMemo(() =>
    Object.values(connections)
      .filter(({ to, from }) => {
        return to === thoughtId || from === thoughtId;
      })
      .map(({ id, to, from }) => {
        const otherThought = thoughts.find(({ id: otherThoughtId }) => otherThoughtId !== thoughtId && (otherThoughtId === to || otherThoughtId === from));
        return {
          isParent: otherThought.id === to,
          otherThought,
          connectionId: id,
        };
      })
  , [thoughtId, connections, thoughts]);

  const plan = useMemo(() => {
    return plans.find(({ id }) => thought && id === thought.planId);
  }, [plans, thought]);

  const thoughtSections = thought && thought.sections ?
    thought.sections :
    plan && plan.defaultSections ?
      plan.defaultSections :
      DEFAULT_SECTIONS;

  const thoughtStatuses = useMemo(() => {
    if (typeof thoughtId === 'string') {
      return (statusesByThought[thoughtId] || [])
        .map(statusId => statuses[statusId])
        .filter(Boolean);
    }
    return [];
  }, [statuses, statusesByThought, thoughtId]);

  const pinnedPictures: Picture[] = useMemo(() => {
    return Object.values(pictures).filter(picture => {
      return picture.pinned && picture.thoughtId === thoughtId;
    });
  }, [thoughtId, pictures]);

  const handleUpdate = useCallback(async updatedThought => {
    await thoughtActions.editThought(db, updatedThought);
  }, []);

  const handleEditAllSections = useCallback(() => {
    setDisplaySettings(false);
    setEditAllSections(true);
  }, []);

  const handleCancelEditAllSections = useCallback(() => {
    setEditAllSections(false);
  }, []);

  const handleApplySectionState = useCallback(() => {
    planActions.editPlan(db, {
      ...plan,
      defaultSections: thought.sections,
    });
  }, [plan, thought]);

  const handleChangeHideFromHomeScreen = useCallback(checked => {
    handleUpdate({
      ...thought,
      hideFromHomeScreen: checked,
    });
  }, [thought]);

  const thoughtSectionsParsed = useMemo(() => {
    return thoughtSections.split('-').map(section => {
      if (section === 'tag') return 'tags';
      if (section === '_tag') return '_tags';
      return section;
    });
  }, [thoughtSections]);

  const sectionOrder = useMemo(() => {
    return thoughtSectionsParsed.map(section => {
      return section.replace(SECTION_DELIMITER_REGEX, '');
    });
  }, [thoughtSectionsParsed]);

  const sectionVisibility = useMemo(() => {
    return thoughtSectionsParsed.reduce((visibility, section) => {

      if (section.startsWith('_')) {
        visibility[section.replace(SECTION_DELIMITER_REGEX, '')] = false;
      } else {
        visibility[section] = true;
      }
      return visibility;
    }, {} as SectionVisibility);
  }, [thoughtSectionsParsed]);

  useEffect(() => {
    setDisplaySettings(false);
  }, []);

  useEffect(() => {
    let unmounted = false;
    const timeout = setTimeout(() => {
      if (unmounted === false) {
        setThreeSecondsElapsed(true);
      }
    }, 3000);

    return () => {
      unmounted = true;
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className={classes.root}>
      {!thought &&
        (threeSecondsElapsed ?
          (<MissingThought />) :
          (<Loading id={'thought-loader'} />))}
      {thought &&
        <ThoughtInformation
          thought={thought}
          tags={relatedTags}
          notes={relatedNotes}
          statusOptions={statusOptions}
          typeOptions={typeOptions}
          tagOptions={tagOptions}
          priorityOptions={PRIORITY_OPTIONS}
          onUpdate={handleUpdate}
          statuses={thoughtStatuses}
          pinnedPictures={pinnedPictures}
          connections={relatedConnections}
          plan={plan}
          sectionOrder={sectionOrder}
          sectionVisibility={sectionVisibility}
          cancelEditAllSections={handleCancelEditAllSections}
          editAllSections={editAllSections}
        />
      }
      <ThoughtSettings
        display={displayThoughtSettings}
        thought={thought}
        tags={relatedTags}
        notes={relatedNotes}
        onEditSections={handleEditAllSections}
        onApplySectionState={handleApplySectionState}
        onChangeHideFromHomeScreen={handleChangeHideFromHomeScreen}
      />
    </div>
  );
};

export default memo(Thought);
