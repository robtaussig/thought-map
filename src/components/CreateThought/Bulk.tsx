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
import { connections as connectionsActions } from '../../actions';
interface CreateBulkThoughtProps {
  onClose: () => void;
}

const depthRegex = /^-+/;
const getNumDashes = (title: string) => depthRegex.exec(title)?.[0].length ?? 0;
const stripLeadingDashes = (title: string) => title.replace(depthRegex,'');

export const CreateBulkThought: FC<CreateBulkThoughtProps> = ({ onClose }) => {
  const classes = useBulkStyles({});
  const [inputValue, setInputValue] = useState<string>('');
  const plans = useSelector(planSelector);
  const { db } = useLoadedDB();
  const { history } = useApp();
  const planId = getIdFromUrl(history, 'plan');
  const plan = plans.find(plan => plan.id === planId);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const indexMap: { [idx: number]: number } = {};
    const thoughtTitles = inputValue
      .split('\n')
      .filter(Boolean)
      .reverse();

    thoughtTitles.forEach((title, idx) => {
      const dashes = getNumDashes(title);
      if (dashes > 0) {
        for (let next = idx + 1; next <= thoughtTitles.length - 1; next++) {
          const nextDashes = getNumDashes(thoughtTitles[next]);
          if (nextDashes === dashes - 1) {
            indexMap[idx] = next;
            break;
          }
        }
      }
    });

    const thoughts = await Promise.all(thoughtTitles.map(title => createWholeThought(db, {
      ...DEFAULT_STATE,
      title: stripLeadingDashes(title),
      type: (plan && plan.defaultType) || DEFAULT_STATE.type,
    }, planId)));

    await Promise.all(thoughts.map(({ thought }, thoughtIdx) => {
      if (thoughtIdx in indexMap) {
        const prevThought = thoughts[indexMap[thoughtIdx]].thought;
        return connectionsActions.createConnection(db, {
          from: prevThought.id,
          to: thought.id,
        });
      }
    }))
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
