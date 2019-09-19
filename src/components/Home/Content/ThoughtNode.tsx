import React, { useCallback, FC } from 'react';
import useApp from '../../../hooks/useApp';
import { useLoadedDB } from '../../../hooks/useDB';
import Select from '../../General/Select';
import { statuses as statusActions } from '../../../actions';
import { homeUrl } from '../../../lib/util';
import { Thought } from 'store/rxdb/schemas/thought';

interface ThoughtNodeProps {
  classes: any;
  thought: Thought;
  statusOptions: string[];
}

const STATUS_TO_COLOR: { [key: string]: string } = {
  'new': 'gold',
  'in progress': 'lightgreen',
  'almost done': 'green',
  'completed': 'midnightblue',
};

const colorFromPriority = (priority: number): string => {
  if (priority === 10) return 'red';
};

const styleFromPriority = (priority: number): { color?: string, fontWeight?: number } => {
  if (priority === 10) {
    return {
      color: colorFromPriority(priority),
      fontWeight: 600,
    };
  }

  return {};
};

export const ThoughtNode: FC<ThoughtNodeProps> = React.memo(({ classes, thought, statusOptions }) => {
  const { history } = useApp();
  const db = useLoadedDB();

  const handleClick = () => {
    history.push(`${homeUrl(history)}thought/${thought.id}`);
  };

  const handleChangeStatus = useCallback(event => {
    statusActions.createStatus(db, {
      text: event.target.value,
      thoughtId: thought.id,
    });
  }, []);

  return (
    <div className={classes.thoughtNode}>
      <span className={classes.thoughtNodeTitle} onClick={handleClick} style={styleFromPriority(thought.priority)}>{thought.title}</span>
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
    </div>
  );
});

export default ThoughtNode;
