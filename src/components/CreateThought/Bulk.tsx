import React, { FC, useState } from 'react';
import TextArea from '../General/TextArea';
import { DEFAULT_STATE } from './';
import useApp from '../../hooks/useApp';
import { useLoadedDB } from '../../hooks/useDB';
import { createWholeThought } from '../../actions/complex';
import { getIdFromUrl } from '../../lib/util';
import { useSelector } from 'react-redux';
import { planSelector } from '../../reducers/plans';
import { bulkListSelector } from '../../reducers/bulkLists';
import { useBulkStyles } from './style';
import { connections as connectionsActions, bulkLists as bulkListsActions } from '../../actions';

interface CreateBulkThoughtProps {
  onClose: () => void;
}

const depthRegex = /^-+/;
const getNumDashes = (title: string) => depthRegex.exec(title)?.[0].length ?? 0;
const stripLeadingDashes = (title: string) => title.replace(depthRegex,'');

export const CreateBulkThought: FC<CreateBulkThoughtProps> = ({ onClose }) => {
  const classes = useBulkStyles({});
  const [inputValue, setInputValue] = useState<string>('');
  const [savedListName, setSavedListName] = useState<string>(null);
  const plans = useSelector(planSelector);
  const bulkLists = useSelector(bulkListSelector);
  const { db } = useLoadedDB();
  const { history } = useApp();
  const planId = getIdFromUrl(history, 'plan');
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
    }));

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
      <button className={classes.submitButton} disabled={inputValue === ''} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default CreateBulkThought;
