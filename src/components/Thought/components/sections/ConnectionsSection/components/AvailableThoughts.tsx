import React, { FC, useMemo, ChangeEvent, useState, Fragment } from 'react';
import { Thought } from 'store/rxdb/schemas/thought';
import Add from '@material-ui/icons/Add';
import Select from '../../../../../General/Select';
import Input from '../../../../../General/Input';
import { useLoadedDB } from '../../../../../../hooks/useDB';
import { Plan } from '../../../../../../store/rxdb/schemas/plan';
import { connections as connectionsActions } from '../../../../../../actions';
import { createWholeThought } from '../../../../../../actions/complex';

interface AvailableThoughtsProps {
  classes: any;
  thoughts: Thought[];
  thoughtId: string;
  plan: Plan;
  onCreate: () => void;
  autoFocus?: boolean;
}

const CONNECT_TO = 'Connect to';
const CONNECT_FROM = 'Connect from';
const FILTER_THOUGHTS = 'Filter Thoughts';

const sortConnections = (left: Thought, right: Thought) => {
  return left.title > right.title ? 1 : -1;
};

export const AvailableThoughts: FC<AvailableThoughtsProps> = ({ classes, thoughts, thoughtId, plan, onCreate, autoFocus = true }) => {
  const { db } = useLoadedDB();
  const [searchText, setSearchText] = useState<string>('');

  const options: Thought[] = useMemo(() => {
    const lowercased = searchText.toLowerCase();
    return thoughts
      .filter(({ title }) => title.toLowerCase().indexOf(lowercased) > -1)
      .sort(sortConnections);
  }, [thoughts, searchText]);

  const handleSelectThought = (field: string) => (e: ChangeEvent<HTMLSelectElement>) => {
    const otherThought = options.find(option => option.title === e.target.value);

    if (field === 'from') {
      connectionsActions.createConnection(db, {
        from: otherThought.id,
        to: thoughtId,
      });
    } else {
      connectionsActions.createConnection(db, {
        from: thoughtId,
        to: otherThought.id,
      });
    }
  };

  const handleClickThought = (title: string, idx: number, field: string) => () => {
    if (field === 'from') {
      connectionsActions.createConnection(db, {
        from: options[idx].id,
        to: thoughtId,
      });
    } else {
      connectionsActions.createConnection(db, {
        from: thoughtId,
        to: options[idx].id,
      });
    }
  };

  const handleCreateConnection = async () => {
    const createdThought = await createWholeThought(db, {
      title: searchText,
      type: plan && plan.defaultType || 'Task',
      date: '',
      time: '',
      description: '',
      notes: [],
      tags: [],
    }, plan.id);

    await connectionsActions.createConnection(db, {
      from: thoughtId,
      to: createdThought.thought.id,
    });

    onCreate();
  };

  return (
    <>
      <Input
        classes={classes}
        id={'filter-thoughts'}
        aria-label={FILTER_THOUGHTS}
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        autoFocus={autoFocus}
        injectedComponent={
          <button
            className={classes.submitButton}
            onClick={handleCreateConnection}
            disabled={searchText === ''}
          >
            <Add/>
          </button>
        }
      />
      {options.length > 10 ? (
        <Fragment>
          <Select
            classes={classes}
            id={'available-thoughts'}
            aria-label={CONNECT_TO}
            value={CONNECT_TO}
            onChange={handleSelectThought('to')}
            options={[CONNECT_TO].concat(options.map(({ title }) => title))}
          />
          <Select
            classes={classes}
            id={'available-thoughts'}
            aria-label={CONNECT_FROM}
            value={CONNECT_FROM}
            onChange={handleSelectThought('from')}
            options={[CONNECT_FROM].concat(options.map(({ title }) => title))}
          />
        </Fragment>
      ) : options.length === 0 ? (
        <span className={classes.noMatches}>No matches</span>
      ) : (
        <ul className={classes.thoughtList}>
          {options.map(({ title }, idx) => {
            return (
              <li key={`${title}-${idx}`} className={classes.thoughtItem}>
                {title}
                <div className={classes.buttonsWrapper}>
                  <button onClick={handleClickThought(title, idx, 'from')}>
                    From
                  </button>
                  <span className={classes.buttonsDivider}>/</span>
                  <button onClick={handleClickThought(title, idx, 'to')}>
                    To
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default AvailableThoughts;
