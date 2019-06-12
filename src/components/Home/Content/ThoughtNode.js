import React, { useCallback } from 'react';
import useApp from '../../../hooks/useApp'
import { useLoadedDB } from '../../../hooks/useDB';
import Select from '../../General/Select';
import { STATUS_OPTIONS } from '../../Thought';
import { thoughts as thoughtActions } from '../../../actions';

export const ThoughtNode = React.memo(({ classes, thought, updateStatus }) => {
  const { history, dispatch } = useApp();
  const db = useLoadedDB();

  const handleClick = () => {
    history.push(`/thought/${thought.id}`);
  };

  const handleChangeStatus = useCallback(event => {
    thoughtActions.editThought(db, Object.assign({}, thought, {
      status: event.target.value,
    }));
  }, []);

  return (
    <div className={classes.thoughtNode}>
      <span className={classes.thoughtNodeTitle} onClick={handleClick}>{thought.title}</span>
      <Select
        id={'status-select'}
        classes={classes}
        value={thought.status}
        options={STATUS_OPTIONS}
        onChange={handleChangeStatus}
      />
    </div>
  );
});

export default ThoughtNode;
