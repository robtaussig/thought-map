import React, { useState, useMemo, useEffect, FC, useRef } from 'react';
import useApp from '../../hooks/useApp';
import { withStyles, StyleRules } from '@material-ui/core/styles';
import Input from '../General/Input';
import Search from '@material-ui/icons/Search';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { Thought } from 'store/rxdb/schemas/thought';
import { Note } from 'store/rxdb/schemas/note';
import { Tag } from 'store/rxdb/schemas/tag';

interface ThoughtSearchProps {
  classes: any;
  thoughts: Thought[];
  notes: Notes;
  tags: Tags;
  close: () => void;
}

export interface ThoughtMatch {
  id: string;
  title?: string;
}

interface TrieNode {
  [char: string]: TrieNode;
}

interface TrieNodes {
  [thoughtId: string]: TrieNode;
}

export interface Notes {
  [noteId: string]: Note;
}

export interface Tags {
  [tagId: string]: Tag;
}

export class Searchable {
  roots: TrieNodes = {};

  buildTree = (thoughts: Thought[], notes: Notes, tags: Tags): void => {

    thoughts.forEach(({ id, date, description, status, time, title, type }) => {
      this.buildNode(id, [date, description, status, time, title, type]);
    });

    Object.values(notes).forEach(({ thoughtId, text }) => {
      this.buildNode(thoughtId, [text]);
    });

    Object.values(tags).forEach(({ thoughtId,  text }) => {
      this.buildNode(thoughtId, [text]);
    });
  }

  buildNode = (thoughtId: string, values: (string|number)[]): void => {
    this.roots[thoughtId] = this.roots[thoughtId] || {};
    let node = this.roots[thoughtId];
    values.forEach(value => {
      String(value).toLowerCase().split(' ').forEach(word => {
        node = this.roots[thoughtId];
        word.split('').forEach(char => {
          node[char] = node[char] || {};
          node = node[char];
        });
      });
    });
  }

  hasMatch = (input: string) => ([thoughtId, rootNode]: [string, TrieNode]): boolean => {
    let node = rootNode;
    
    for (let i = 0; i < input.length; i++) {
      if (!node[input[i]]) return false;
      node = node[input[i]];
    }

    return true;
  }

  findMatches = (input: string): ThoughtMatch[] => {
    if (input === '') return [];
    const matches: ThoughtMatch[] = Object.entries(this.roots).filter(this.hasMatch(input.toLowerCase())).map(([key]) => {
      return {
        id: key,
      }
    });

    return matches;
  }
}

export const ThoughtSearch: FC<ThoughtSearchProps> = ({ classes, thoughts, notes, tags, close }) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const { history } = useApp();
  const [matchingThoughts, setMatchingThoughts] = useState<ThoughtMatch[]>([]);
  const searchTree = useRef<Searchable>(new Searchable());

  useEffect(() => {
    searchTree.current.buildTree(thoughts, notes, tags);
  }, [thoughts, notes, tags]);

  useEffect(() => {
    const matches = searchTree.current.findMatches(searchInput);
    const filteredAndWithTitles = matches.reduce((next, { id }) => {
      const thought = thoughts.find(thought => thought.id === id);
      if (thought) {
        next.push({
          id, title: thought.title,
        });
      }
      return next;
    }, []);
    
    setMatchingThoughts(filteredAndWithTitles);
    
  }, [searchInput]);

  const handleOpenThought = (id: string) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    history.push(`/thought/${id}`);
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
    overflow: 'hidden',
    height: '100%',
  },
  inputLabel: {
    display: 'flex',
    width: '100%',
    backgroundColor: 'white',
    flex: '0 0 32px',
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 30,
    '& > input': {
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
    flex: 1,
    overflow: 'scroll',
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
