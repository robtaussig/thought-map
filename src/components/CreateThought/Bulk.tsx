import React, { FC, useState } from 'react';
import TextArea from '../General/TextArea';
import { CreatedThought, DEFAULT_STATE } from './';
import { useLoadedDB } from '../../hooks/useDB';
import { createWholeThought } from '../../actions/complex';
import { useIdFromUrl } from '../../lib/util';
import { useDispatch, useSelector } from 'react-redux';
import { planSelector } from '../../reducers/plans';
import { bulkListSelector } from '../../reducers/bulkLists';
import { useBulkStyles } from './style';
import { bulkLists as bulkListsActions, connections as connectionsActions } from '../../actions';
import { bulkCreateThoughtsAndConnections } from '../../reducers/actions';

interface CreateBulkThoughtProps {
  initial: CreatedThought;
  onClose: () => void;
  onReopenSingle: () => void;
}

const depthRegex = /^-+/;
const getNumDashes = (title: string) => depthRegex.exec(title)?.[0].length ?? 0;
const stripLeadingDashes = (title: string) => title.replace(depthRegex,'');

export const CreateBulkThought: FC<CreateBulkThoughtProps> = ({ initial, onClose, onReopenSingle }) => {
  const classes = useBulkStyles({});
  const [inputValue, setInputValue] = useState<string>(initial.title);
  const [savedListName, setSavedListName] = useState<string>(null);
  const plans = useSelector(planSelector);
  const bulkLists = useSelector(bulkListSelector);
  const { db } = useLoadedDB();
  const dispatch = useDispatch();
  const planId = useIdFromUrl('plan');
  const plan = plans.find(plan => plan.id === planId);
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const indexMap: { [idx: number]: number } = {};
    onClose();
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
    (window as any).blockNotifications = true;
    (window as any).batchingBulkThoughts = true;

    const thoughts = await Promise.all(thoughtTitles.map(title => createWholeThought(db, {
      ...DEFAULT_STATE,
      title: stripLeadingDashes(title),
      type: (plan && plan.defaultType) || DEFAULT_STATE.type,
    }, planId)));

    const connections = await Promise.all(thoughts.map(({ thought }, thoughtIdx) => {
      if (thoughtIdx in indexMap) {
        const prevThought = thoughts[indexMap[thoughtIdx]].thought;
        return connectionsActions.createConnection(db, {
          from: prevThought.id,
          to: thought.id,
        });
      }
    }));

    dispatch(bulkCreateThoughtsAndConnections({
      thoughts: thoughts.map(({ thought }) => thought),
      connections: connections.filter(Boolean),
      statuses: thoughts.map(({ status }) => status),
    }));
    setTimeout(() => {
      (window as any).batchingBulkThoughts = false;
    }, 500);
    (window as any).blockNotifications = false;
  };

  const handleSave = async () => {
    await bulkListsActions.createBulkList(db, {
      list: inputValue,
      name: savedListName,
    });

    setSavedListName(null);
  };

  const handleSelectBulkList = (selected: any) => {
    const bulkList = bulkLists.find(bulkList => bulkList.id === selected.target.value);
    if (bulkList) {
      setInputValue(bulkList.list);
    }
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
          inputProps={{
            placeholder: 'Parent thought\n-Child Thought\n-Second Child Thought\n--Child of Second Child Thought',
          }}
        />
      </form>
      {savedListName === null ? (
        <>
          <select className={classes.bulkListOptions} onChange={handleSelectBulkList}>
            <option value={null} label={'Bulk Lists'}/>
            {bulkLists.map(list => {
              return (
                <option key={`${list.id}-list`} value={list.id} label={list.name}/>
              );
            })}
          </select>
          <button className={classes.saveButton} disabled={inputValue === ''} onClick={() => setSavedListName('')}>
            Save List
          </button>
        </>
      ): (
        <>
          <input
            className={classes.savedListInput}
            type={'text'}
            value={savedListName}
            placeholder={'Enter List Name'}
            onChange={e => setSavedListName(e.target.value)}
            autoFocus
          />
          <button className={classes.saveButton} disabled={savedListName === ''} onClick={handleSave}>
            Submit name
          </button>
        </>
      )}
      <div className={classes.buttons}>
        <button
          className={classes.singleAddThought}
          onClick={onReopenSingle}
        >
        Single
        </button>
        <button className={classes.submitButton} disabled={inputValue === ''} onClick={handleSubmit}>
        Submit
        </button>
      </div>
    </div>
  );
};

export default CreateBulkThought;
