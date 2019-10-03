import './style.scss';
import React, { useRef, FC, Fragment, useState, useMemo, EventHandler, FormEventHandler, useEffect } from 'react';
import ThoughtNode from './ThoughtNode';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import { Plan } from '~store/rxdb/schemas/plan';
import { Thought } from '~store/rxdb/schemas/thought';
import classNames from 'classnames';
import Input from '../../General/Input';
import Search from '@material-ui/icons/Search';
import Close from '@material-ui/icons/Close';
import { Searchable } from '../ThoughtSearch';
import { useNestedXReducer } from '../../../hooks/useXReducer';
import useApp from '../../../hooks/useApp';
import useLongPress from '../../../hooks/useLongPress';
import { AppState, SortFilterField } from '~reducers';

interface ContentProps {
  classes: any;
  thoughts: Thought[];
  plan: Plan;
  statusOptions: string[];
  typeOptions: string[];
  state: AppState;
}

export const Content: FC<ContentProps> = React.memo(({ classes, thoughts, plan, statusOptions, typeOptions, state }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { dispatch } = useApp();
  const lastScrollPos = useRef<number>(0);
  const setSearchFocus = useRef<(shouldFocus: boolean) => void>(() => {});
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const handleLongPress = useLongPress(() => {
    setShowFilters(false);
    setSearchFocus.current(true);
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [matchingThoughts, setMatchingThoughts] = useState<string[]>(null);
  const searchTree = useRef<Searchable>(new Searchable());
  const [notes] = useNestedXReducer('notes', state, dispatch);
  const [tags] = useNestedXReducer('tags', state, dispatch);
  const [sortFilterSettings, setSortFilterSettings] = useNestedXReducer('sortFilterSettings', state, dispatch);

  const handleSortBy = (name: SortFilterField) => () => setSortFilterSettings(({ field, desc }) => ({
    field: field === name && desc === false ? null : name,
    desc: field === name ?
      desc === false ? null : !desc :
      true
  }));

  const thoughtComponents = useMemo(() => {
    const filterCompletedThoughts = (thought: Thought) => searchTerm !== '' || (plan && plan.showCompleted) || (thought.status !== 'completed' && thought.status !== 'won\'t fix');
    const filterMatchedThoughts = (thought: Thought) => {
      return matchingThoughts === null || matchingThoughts.includes(thought.id);
    };
    const sortBySortRule = (left: Thought, right: Thought): number => {
      if (sortFilterSettings.field) {
        const leftIsBigger = left[sortFilterSettings.field] &&
          (!right[sortFilterSettings.field] || (left[sortFilterSettings.field].toLowerCase() > right[sortFilterSettings.field].toLowerCase()));
        
        return (leftIsBigger && sortFilterSettings.desc) || (!leftIsBigger && !sortFilterSettings.desc) ? 1 : -1;
      }
      return 1;
    };

    return thoughts
      .filter(filterCompletedThoughts)
      .filter(filterMatchedThoughts)
      .sort(sortBySortRule)
      .map(thought => {
        return (
          <ThoughtNode
            classes={classes}
            key={`thought-node-${thought.id}`}  
            thought={thought}
            statusOptions={statusOptions}
            typeOptions={typeOptions}
            displayField={sortFilterSettings.field}
          />
        );
      });
  }, [thoughts, plan, sortFilterSettings, matchingThoughts, searchTerm !== '']);

  const handleScroll: EventHandler<any> = (e: { target: HTMLDivElement }) => {
    const scrollTop = e.target.scrollTop;
    setShowFilters(scrollTop < lastScrollPos.current);
    lastScrollPos.current = scrollTop;
  };

  const handleSubmitSearch: FormEventHandler = e => {
    e.preventDefault();
  };

  useEffect(() => {
    searchTree.current.buildTree(thoughts, notes, tags);
  }, [thoughts, notes, tags]);

  useEffect(() => {
    const matches = searchTree.current.findMatches(searchTerm);
    
    setMatchingThoughts(searchTerm === '' ? null : matches.map(({ id}) => id));
  }, [searchTerm]);

  const isSearching = showFilters === false || searchTerm !== '';

  return (
    <Fragment>
      <div className={classes.flippableWrapper} {...handleLongPress}>
        <div className={classNames(classes.sortByButtons, 'flippable', isSearching ? 'back' : 'front')}>
          <div className={classes.sortByNames}>
            <button className={classNames(classes.sortButton, {
              selected: sortFilterSettings.field === 'title'
            })} onClick={handleSortBy('title')}>
              Name
              {sortFilterSettings.field === 'title' ?
                (sortFilterSettings.desc ? <ExpandMore/> : <ExpandLess/>) :
                <UnfoldMore/>
              }
            </button>
          </div>
          <div className={classes.sortByStatus}>
          <button className={classNames(classes.sortButton, {
            selected: sortFilterSettings.field === 'status'
          })} onClick={handleSortBy('status')}>
            Status
          </button>
          /
          <button className={classNames(classes.sortButton, {
            selected: sortFilterSettings.field === 'type'
          })} onClick={handleSortBy('type')}>
            Type
          </button>
          {['status', 'type'].includes(sortFilterSettings.field) ?
            (sortFilterSettings.desc ? <ExpandMore/> : <ExpandLess/>) :
            <UnfoldMore/>
          }
          </div>
        </div>
        <form className={classNames(classes.searchWrapper, 'flippable', isSearching ? 'front' : 'back')} onSubmit={handleSubmitSearch}>
          <Input classes={classes} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} aria-label={'Search'} setFocus={setSearchFocus => setSearchFocus.current = setSearchFocus}/>
          {searchTerm === '' ?
            (<button className={classes.searchButton}><Search/></button>) :
            (<button className={classes.searchButton} onClick={() => setSearchTerm('')}><Close/></button>)}
        </form>
      </div>
      <div className={classes.content} ref={rootRef} onScroll={handleScroll}>
        {thoughtComponents}
      </div>
    </Fragment>
  );
});

export default Content;
