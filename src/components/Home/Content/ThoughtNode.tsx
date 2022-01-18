import React, { FC, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoadedDB } from '../../../hooks/useDB';
import Select from '../../General/Select';
import { connections as connectionsActions, statuses as statusActions, thoughts as thoughtActions, } from '../../../actions';
import { useHomeUrl } from '../../../lib/util';
import { Thought } from 'store/rxdb/schemas/thought';
import useLongPress from '../../../hooks/useLongPress';
import useModal from '../../../hooks/useModal';
import ThoughtNodeSettings from './ThoughtNodeSettings';
import ConnectionStatus from './ConnectionStatus';
import classNames from 'classnames';
import { ThoughtConnections } from './types';
import { Graph } from './lib/graph';
import Add from '@material-ui/icons/Add';
import { Cancel } from '@material-ui/icons';
import CreatingNextThought, { CreatableThought } from './CreatingNextThought';
import { createWholeThought } from '../../../actions/complex';

interface ThoughtNodeProps {
  classes: any;
  thought: Thought;
  statusOptions: string[];
  typeOptions: string[];
  displayField: string;
  planName: string;
  arrivedFrom: boolean;
  thoughts: Thought[];
  connectionStatusByThought: ThoughtConnections;
  thoughtMap: MutableRefObject<Graph>;
  left: number;
  isLastChild?: boolean;
}

export const STATUS_TO_COLOR: { [key: string]: string } = {
  'new': '#0282d0',
  'in progress': '#06922c',
  'won\'t fix': '#c71b1b',
  'completed': '#000cb3',
};

const colorFromPriority = (priority: number): string => {
  if (priority > 7) return 'red';
};

const styleFromPriority = (priority: number): { color?: string, fontWeight?: number } => {
  if (priority > 7) {
    return {
      color: colorFromPriority(priority),
      fontWeight: 600,
    };
  }

  return {};
};

const generateDateTimeString = (thought: Thought): string => {
  if (thought.date && thought.time) {
    return `${thought.date} @ ${thought.time}`;
  } else if (thought.date) {
    return thought.date;
  } else if (thought.time) {
    return `Today @ ${thought.time}`;
  }
};

export const ThoughtNode: FC<ThoughtNodeProps> = React.memo(({
  classes,
  thought,
  statusOptions,
  typeOptions,
  displayField,
  planName,
  arrivedFrom,
  thoughts,
  connectionStatusByThought,
  thoughtMap,
  left,
  isLastChild,
}) => {
  const navigate = useNavigate();
  const { db } = useLoadedDB();
  const [showConnections, setShowConnections] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [openModal, closeModal] = useModal();
  const homeUrl = useHomeUrl();
  const [isCreatingNextThought, setIsCreatingNextThought] = useState(false);

  const handleClick = () => {
    navigate(`${homeUrl}thought/${thought.id}`);
  };

  const handleLongPress = useLongPress(() => {
    openModal(<ThoughtNodeSettings thought={thought} onClose={closeModal} />);
  }, 400, {
    onClick: handleClick,
  });

  const connectionStatus = connectionStatusByThought[thought.id];
  const nextThoughts = useMemo(() => {
    return thoughtMap.current.children(thought.id);
  }, [connectionStatus]);

  const handleChangeStatus = useCallback(event => {
    statusActions.createStatus(db, {
      text: event.target.value,
      thoughtId: thought.id,
    });
  }, []);

  const handleChangeType = useCallback(event => {
    thoughtActions.editThought(db, {
      ...thought,
      type: event.target.value,
    });
  }, []);

  const handleCreateNextThought = useCallback(async ({ title, relationship }: CreatableThought) => {
    setIsCreatingNextThought(false);
    const createdThought = await createWholeThought(db, {
      title,
      type: 'Task',
      date: '',
      time: '',
      description: '',
      notes: [],
      tags: [],
    }, thought.planId);

    if (relationship === 'from') {
      connectionsActions.createConnection(db, {
        from: createdThought.thought.id,
        to: thought.id,
      });
    } else {
      connectionsActions.createConnection(db, {
        from: thought.id,
        to: createdThought.thought.id,
      });
    }
  }, [thought.planId]);

  useEffect(() => {
    if (arrivedFrom) {
      wrapperRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  }, []);

  useEffect(() => {
    if (showConnections) {
      wrapperRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showConnections]);

  const _mainThoughtNode = (
    <div
      ref={wrapperRef}
      style={{
        marginLeft: left * 15,
        borderLeft: left === 0 ? undefined : '1px solid gray',
        borderBottom: (showConnections || isLastChild) ? '1px solid gray' : undefined,
      }}
      className={classes.thoughtNode}
    >
      <div className={classes.thoughtNodeTitleWrapper}>
        {planName ? (
          <span className={classes.planName}>{planName}<span className={classes.dateTime}>{generateDateTimeString(thought)}</span></span>
        ) : (
          <span className={classes.dateTime}>{generateDateTimeString(thought)}</span>
        )}
        <span className={classNames(classes.thoughtNodeTitle, {
          arrivedFrom,
        })} {...handleLongPress} style={styleFromPriority(thought.priority)}>{thought.title}</span>
      </div>
      {connectionStatus && (
        <ConnectionStatus
          classes={classes}
          connectionStatus={connectionStatus}
          expanded={showConnections}
          onToggle={setShowConnections}
        />
      )}
      {isCreatingNextThought ? (
        <button className={classes.addConnectionButton} onClick={() => setIsCreatingNextThought(false)}>
          <Cancel fontSize='small'/>
        </button>
      ) : (
        <button className={classes.addConnectionButton} onClick={() => setIsCreatingNextThought(true)}>
          <Add fontSize='small'/>
        </button>
      )}
      {displayField === 'type' ? (
        <Select
          id={'status-select'}
          classes={classes}
          value={thought.type}
          options={typeOptions}
          onChange={handleChangeType}
        />
      ) : (
        <Select
          id={'status-select'}
          classes={classes}
          value={thought.status}
          options={statusOptions}
          onChange={handleChangeStatus}
          style={{
            backgroundColor: STATUS_TO_COLOR[thought.status],
          }}
        />
      )}
    </div>
  );

  return (
    <div className={classes.expandedThoughtNode}>
      {_mainThoughtNode}
      {isCreatingNextThought && (
        <CreatingNextThought styleOverwrite={{
          marginLeft: (left + 1) * 15,
          borderLeft: '1px solid gray',
          borderBottom: '1px solid gray',
        }} onSubmit={handleCreateNextThought}/>
      )}
      {showConnections && nextThoughts.map((thoughtId, idx) => {
        return (
          <ThoughtNode
            key={`${thought.id}-${thoughtId}-next-thought`}
            classes={classes}
            thought={thoughts.find(({ id }) => id === thoughtId)}
            statusOptions={statusOptions}
            typeOptions={typeOptions}
            displayField={displayField}
            connectionStatusByThought={connectionStatusByThought}
            thoughtMap={thoughtMap}
            thoughts={thoughts}
            planName={planName}
            arrivedFrom={false}
            left={left + 1}
            isLastChild={idx === nextThoughts.length - 1}
          />
        );
      })}
    </div>
  );
});

export default ThoughtNode;
