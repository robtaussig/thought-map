import React, { FC, useMemo, ChangeEvent, useState } from 'react';
import { Thought } from 'store/rxdb/schemas/thought';
import Select from '../../../../../General/Select';
import Input from '../../../../../General/Input';
import { useLoadedDB } from '../../../../../../hooks/useDB';
import { connections as connectionsActions } from '../../../../../../actions';

interface AvailableThoughtsProps {
  classes: any;
  thoughts: Thought[];
  thoughtId: string;
}

const CONNECT_TO = 'Connect to';
const FILTER_THOUGHTS = 'Filter Thoughts';

const sortConnections = (left: Thought, right: Thought) => {
  return left.title > right.title ? 1 : -1;
};

export const AvailableThoughts: FC<AvailableThoughtsProps> = ({ classes, thoughts, thoughtId }) => {
  const db = useLoadedDB();
  const [searchText, setSearchText] = useState<string>('');

  const options: Thought[] = useMemo(() => {
    const lowercased = searchText.toLowerCase();
    return thoughts
      .filter(({ title }) => title.toLowerCase().indexOf(lowercased) > -1)
      .sort(sortConnections);
  }, [thoughts, searchText]);

  const handleSelectThought = (e: ChangeEvent<HTMLSelectElement>, idx: number) => {
    connectionsActions.createConnection(db, {
      from: thoughtId,
      to: options[idx - 1].id,
    });
  };

  const handleClickThought = (title: string, idx: number) => () => {
    connectionsActions.createConnection(db, {
      from: thoughtId,
      to: options[idx].id,
    });
  };

  return (
    <div className={classes.availableThoughts}>
      <Input
        classes={classes}
        id={'filter-thoughts'}
        aria-label={FILTER_THOUGHTS}
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        autoFocus
      />
      {options.length > 10 ? (<Select
        classes={classes}
        id={'available-thoughts'}
        aria-label={CONNECT_TO}
        value={CONNECT_TO}
        onChange={handleSelectThought}
        options={[CONNECT_TO].concat(options.map(({ title }) => title))}
      />) : options.length === 0 ? (
        <span className={classes.noMatches}>No matches</span>
      ) : (
        <ul className={classes.thoughtList}>
          {options.map(({ title }, idx) => {
            return (
              <li key={`${title}-${idx}`} className={classes.thoughtItem}>
                <button onClick={handleClickThought(title, idx)}>
                  {title}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AvailableThoughts;
