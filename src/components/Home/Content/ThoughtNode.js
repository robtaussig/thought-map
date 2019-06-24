import React, { useCallback } from 'react';
import useApp from '../../../hooks/useApp'
import { useLoadedDB } from '../../../hooks/useDB';
import Select from '../../General/Select';
import { STATUS_OPTIONS } from '../../Thought';
import { thoughts as thoughtActions } from '../../../actions';
import { homeUrl } from '../../../lib/util';

const STATUS_TO_COLOR = {
  'new': 'gold',
  'pending': 'orange',
  'in progress': 'lightgreen',
  'almost done': 'green',
  'completed': 'midnightblue',
};

const colorFromPriority = priority => {
  if (priority === 10) return 'red';
};

const styleFromPriority = priority => {
  if (priority === 10) {
    return {
      color: colorFromPriority(priority),
      fontWeight: 600,
    };
  }

  return {};
};

export const ThoughtNode = React.memo(({ classes, thought }) => {
  const { history, dispatch } = useApp();
  const db = useLoadedDB();

  const handleClick = () => {
    history.push(`${homeUrl(history)}thought/${thought.id}`);
  };

  const handleChangeStatus = useCallback(event => {
    thoughtActions.editThought(db, Object.assign({}, thought, {
      status: event.target.value,
    }));
  }, []);

  return (
    <div className={classes.thoughtNode}>
      <span className={classes.thoughtNodeTitle} onClick={handleClick} style={styleFromPriority(thought.priority)}>{thought.title}</span>
      <Select
        id={'status-select'}
        classes={classes}
        value={thought.status}
        options={STATUS_OPTIONS}
        onChange={handleChangeStatus}
        style={{
          backgroundColor: STATUS_TO_COLOR[thought.status],
        }}
      />
    </div>
  );
});

export default ThoughtNode;
