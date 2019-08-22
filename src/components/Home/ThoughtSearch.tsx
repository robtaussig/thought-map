import React, { useState, useMemo, useEffect, FC } from 'react';
import { withStyles, StyleRules } from '@material-ui/core/styles';
import Input from '../General/Input';
import Search from '@material-ui/icons/Search';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { Thought } from 'store/rxdb/schemas/thought';
import { Note } from 'store/rxdb/schemas/note';
import { Tag } from 'store/rxdb/schemas/tag';

interface ThoughtSearchProps {
  classes: any,
  thoughts: Thought[],
  notes: Note[],
  tags: Tag[],
  close: () => void,
}

class Searchable {
  constructor(thoughts: Thought[], notes: Note[], tags: Tag[]) {

  }

  findMatches(input: string) {
    if (input === '') return [];
    
    return [
      {
        id: '3434234',
        title: 'Test thought 1',
      },
      {
        id: '34342343',
        title: 'Test thought 2',
      },
      {
        id: '34347234',
        title: 'Test thought 3',
      },
      {
        id: '34342354',
        title: 'Test thought 4',
      },
    ];
  }
}

export const ThoughtSearch: FC<ThoughtSearchProps> = ({ classes, thoughts, notes, tags, close }) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [matchingThoughts, setMatchingThoughts] = useState<Thought[]>([]);

  const searchable = useMemo(() => {
    return new Searchable(thoughts, notes, tags);
  }, [thoughts, notes, tags]);

  useEffect(() => {
    setMatchingThoughts(searchable.findMatches(searchInput));
  }, [searchInput, searchable]);

  const handleOpenThought = (id: string) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  };

  return (
    <div className={classes.root}>
      <Input
        classes={classes}
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
        autoFocus
        placeholder={'Search all thoughts'}
        injectedComponent={(<button className={classes.searchButton}><Search/></button>)}
      />
      <ul className={classes.matchingThoughts}>
        {matchingThoughts.map(thought => {
          return (
            <li key={`${thought.id}`} className={classes.matchingThought}>
              <button className={classes.matchingThoughtButton} onClick={handleOpenThought(thought.id)}>
                {thought.title}
                <ChevronRight/>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputLabel: {
    display: 'flex',
    width: '100%',
    backgroundColor: 'white',
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 30,
    '& > div': {
      flex: 1,
    }
  },
  inputField: {
    height: '100%',
    width: '100%',
    marginLeft: 5,
    outline: 'none',
    fontSize: 18,
  },
  searchButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  matchingThoughts: {
    display: 'flex',
    flexDirection: 'column',
  },
  matchingThought: {
    '& > button': {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
      backgroundColor: 'midnightblue',
      margin: '3px 0',
      color: 'white',
      padding: '2px 5px',
    }
  },
});

export default withStyles(styles)(ThoughtSearch);
