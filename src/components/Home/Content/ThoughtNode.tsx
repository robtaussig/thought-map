import React, { useCallback, FC, useRef, useEffect, useState, useMemo, MutableRefObject } from 'react';
import useApp from '../../../hooks/useApp';
import { useLoadedDB } from '../../../hooks/useDB';
import Select from '../../General/Select';
import { statuses as statusActions, thoughts as thoughtActions } from '../../../actions';
import { homeUrl } from '../../../lib/util';
import { Thought } from 'store/rxdb/schemas/thought';
import useLongPress from '../../../hooks/useLongPress';
import useModal from '../../../hooks/useModal';
import ThoughtNodeSettings from './ThoughtNodeSettings';
import ConnectionStatus from './ConnectionStatus';
import classNames from 'classnames';
import { ThoughtConnections } from './types';
import { Graph } from './lib/graph';

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

const STATUS_TO_COLOR: { [key: string]: string } = {
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
  const { history } = useApp();
  const { db } = useLoadedDB();
  const [showConnections, setShowConnections] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [openModal, closeModal] = useModal();

  const handleClick = () => {
    history.push(`${homeUrl(history)}thought/${thought.id}`);
  };

  const handleLongPress = useLongPress(() => {
    openModal(<ThoughtNodeSettings thought={thought} onClose={closeModal} />);
  }, 400, {
    onClick: handleClick,
  });

  const connectionStatus = connectionStatusByThought[thought.id];
  const nextThoughts = useMemo(() => {
    return thoughtMap.current.children(thought.id)
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

  if (showConnections) {
    return (
      <div className={classes.expandedThoughtNode}>
        {_mainThoughtNode}
        {nextThoughts.map((thoughtId, idx) => {
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
  }

  return _mainThoughtNode;
});

export default ThoughtNode;
