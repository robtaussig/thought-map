import React, { useCallback, FC, useRef, useEffect } from 'react';
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

interface ThoughtNodeProps {
  classes: any;
  thought: Thought;
  statusOptions: string[];
  typeOptions: string[];
  displayField: string;
  connectionStatus: [number, number];
  planName: string;
  arrivedFrom: boolean;
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

export const ThoughtNode: FC<ThoughtNodeProps> = React.memo(({
  classes,
  thought,
  statusOptions,
  typeOptions,
  displayField,
  connectionStatus,
  planName,
  arrivedFrom,
}) => {
  const { history } = useApp();
  const db = useLoadedDB();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [openModal, closeModal] = useModal();
  const blockClick = useRef<boolean>(false);
  const handleLongPress = useLongPress(() => {
    blockClick.current = true;
    openModal(<ThoughtNodeSettings thought={thought} onClose={closeModal} onLoad={() => blockClick.current = false}/>);
  }, 400);

  const handleClick = () => {
    if (blockClick.current === false) {
      history.push(`${homeUrl(history)}thought/${thought.id}`);
    }
  };

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

  return (
    <div ref={wrapperRef} className={classes.thoughtNode} {...handleLongPress}>
      {planName ? (
        <div className={classes.thoughtNodeTitleWrapper}>
          <span className={classes.planName}>{planName}</span>
          <span className={classNames(classes.thoughtNodeTitle, {
            arrivedFrom,
          })} onClick={handleClick} style={styleFromPriority(thought.priority)}>{thought.title}</span>
        </div>
      ) : (
        <span className={classNames(classes.thoughtNodeTitle, {
          arrivedFrom,
        })} onClick={handleClick} style={styleFromPriority(thought.priority)}>{thought.title}</span>
      )}
      {connectionStatus && (
        <ConnectionStatus
          classes={classes}
          connectionStatus={connectionStatus}
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
});

export default ThoughtNode;
