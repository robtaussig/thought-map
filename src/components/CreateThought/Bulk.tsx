import React, { FC, useState } from 'react';
import TextArea from '../General/TextArea';
import { DEFAULT_STATE } from './';
import useApp from '../../hooks/useApp';
import { useLoadedDB } from '../../hooks/useDB';
import { createWholeThought } from '../../actions/complex';
import { getIdFromUrl } from '../../lib/util';
import { useSelector } from 'react-redux';
import { planSelector } from '../../reducers/plans';
import { useBulkStyles } from './style';

interface CreateBulkThoughtProps {
  onClose: () => void;
}

export const CreateBulkThought: FC<CreateBulkThoughtProps> = ({ onClose }) => {
  const classes = useBulkStyles({});
  const [inputValue, setInputValue] = useState<string>('');
  const plans = useSelector(planSelector);
  const db = useLoadedDB();
  const { history } = useApp();
  const planId = getIdFromUrl(history, 'plan');
  const plan = plans.find(plan => plan.id === planId);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const thoughtTitles = inputValue.split('\n').filter(Boolean);
    thoughtTitles.forEach(title => createWholeThought(db, {
      ...DEFAULT_STATE,
      title,
      type: (plan && plan.defaultType) || DEFAULT_STATE.type,
    }, planId));
    onClose();
  };

  return (
    <div className={classes.root}>
      <h1 className={classes.header}>Create Bulk Thoughts</h1>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextArea
          classes={classes}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          autoFocus
        />
      </form>
      <button className={classes.submitButton} disabled={inputValue === ''} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default CreateBulkThought;
