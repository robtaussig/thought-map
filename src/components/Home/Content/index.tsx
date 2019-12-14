import './style.scss';
import React, { useRef, FC, Fragment, useState, useMemo, EventHandler, FormEventHandler, useEffect } from 'react';
import ThoughtNode from './ThoughtNode';
import BlankThoughtNode from './BlankThoughtNode';
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
import useLongPress from '../../../hooks/useLongPress';
import { Graph } from './lib/graph';
import { ThoughtConnections } from './types';
import { useSelector, useDispatch } from 'react-redux';
import { noteSelector } from '../../../reducers/notes';
import { tagSelector } from '../../../reducers/tags';
import { thoughtSelector } from '../../../reducers/thoughts';
import { connectionSelector } from '../../../reducers/connections';
import { planSelector } from '../../../reducers/plans';
import { sortFilterSettingsSelector, sortBy, SortFilterField } from '../../../reducers/sortFilterSettings';

interface ContentProps {
  classes: any;
  thoughts: Thought[];
  plan: Plan;
  statusOptions: string[];
  typeOptions: string[];
  from: string;
}

export const Content: FC<ContentProps> = React.memo(({ classes, thoughts, plan, statusOptions, typeOptions, from }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const thoughtMap = useRef<Graph>(new Graph());
  const dispatch = useDispatch();
  const lastScrollPos = useRef<number>(0);
  const didMount = useRef<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const handleLongPress = useLongPress(() => {
    setShowFilters(false);
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [matchingThoughts, setMatchingThoughts] = useState<string[]>(null);
  const searchTree = useRef<Searchable>(new Searchable());
  const notes = useSelector(noteSelector);
  const tags = useSelector(tagSelector);
  const stateThoughts = useSelector(thoughtSelector);
  const stateConnections = useSelector(connectionSelector);
  const plans = useSelector(planSelector);
  const sortFilterSettings = useSelector(sortFilterSettingsSelector);

  const handleSortBy = (name: SortFilterField) => () => dispatch(sortBy(name));

  const connectionStatusByThought = useMemo(() => {
    thoughtMap.current
      .updateThoughts(stateThoughts)
      .updateConnections(Object.values(stateConnections));

    return Object.values(stateConnections).reduce((next, { from, to }) => {
      if (thoughts.find(({ id }) => from === id) && thoughts.find(({ id }) => to === id)) {
        next[from] = next[from] || [0,0];
        const otherThought = thoughts.find(otherThought => otherThought.id === to);
        next[from][1]++;
        if (otherThought.status === 'completed') next[from][0]++;
      }
      return next;
    }, {} as ThoughtConnections);
  }, [stateConnections, thoughts, stateThoughts]);

  const thoughtComponents = useMemo(() => {
    if (thoughts.length === 0) {
      return new Array(10).fill(null).map((_, idx) => {
        return (
          <BlankThoughtNode
            key={`${idx}-blank-thought`}
          />
        );
      });
    }

    const filterCompletedThoughts = (thought: Thought) => searchTerm !== '' || (plan && plan.showCompleted) || (thought.status !== 'completed' && thought.status !== 'won\'t fix');
    const filterMatchedThoughts = (thought: Thought) => {
      return matchingThoughts === null || matchingThoughts.includes(thought.id);
    };
    const filterChildrenThoughts = (thought: Thought) => {
      return (!(plan?.groupThoughts ?? true)) ||
        ((matchingThoughts !== null && matchingThoughts.includes(thought.id)) ||
        thoughtMap.current.isRoot(thought.id));
    };
    const filterHiddenThoughts = (thought: Thought) => {
      return Boolean(plan) || (thought.hideFromHomeScreen !== true);
    };

    const sortBySortRule = (left: Thought, right: Thought): number => {
      if (sortFilterSettings.field) {
        const leftIsBigger = left[sortFilterSettings.field] &&
          (!right[sortFilterSettings.field] || (left[sortFilterSettings.field].toLowerCase() > right[sortFilterSettings.field].toLowerCase()));
        
        return (leftIsBigger && sortFilterSettings.desc) || (!leftIsBigger && !sortFilterSettings.desc) ? 1 : -1;
      }
      return 1;
    };

    const planNamesById = plans.reduce((next, statePlan) => {
      next[statePlan.id] = statePlan.name;
      return next;
    }, {} as { [planId: string]: string });

    const combinedFilters = (thought: Thought): boolean => {
      return filterCompletedThoughts(thought) &&
        filterMatchedThoughts(thought) &&
        filterChildrenThoughts(thought) &&
        filterHiddenThoughts(thought);
    };

    return thoughts
      .filter(combinedFilters)
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
            thoughts={thoughts}
            planName={!plan && (planNamesById[thought.planId] || 'Uncategorized')}
            arrivedFrom={from === thought.id}
            connectionStatusByThought={connectionStatusByThought}
            thoughtMap={thoughtMap}
            left={0}
          />
        );
      });
  }, [thoughts, plan, plans, sortFilterSettings, matchingThoughts, searchTerm !== '', connectionStatusByThought, stateConnections]);

  const handleScroll: EventHandler<any> = (e: { target: HTMLDivElement }) => {
    if (didMount.current === true) {
      const scrollTop = e.target.scrollTop;
      setShowFilters(scrollTop < lastScrollPos.current);
      lastScrollPos.current = scrollTop;
    }
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

  useEffect(() => {
    const timeout = setTimeout(() => didMount.current = true, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const isSearching = showFilters === false || searchTerm !== '';

  return (
    <Fragment>
      <div className={classes.flippableWrapper} {...handleLongPress}>
        <div className={classNames(classes.sortByButtons, 'flippable', isSearching ? 'back' : 'front')}>
          <div className={classes.sortByNames}>
            <button className={classNames(classes.sortButton, {
              selected: sortFilterSettings.field === SortFilterField.Title
            })} onClick={handleSortBy(SortFilterField.Title)}>
              Name
              {sortFilterSettings.field === SortFilterField.Title ?
                (sortFilterSettings.desc ? <ExpandMore/> : <ExpandLess/>) :
                <UnfoldMore/>
              }
            </button>
          </div>
          <div className={classes.sortByStatus}>
          <button className={classNames(classes.sortButton, {
            selected: sortFilterSettings.field === SortFilterField.Status
          })} onClick={handleSortBy(SortFilterField.Status)}>
            Status
          </button>
          /
          <button className={classNames(classes.sortButton, {
            selected: sortFilterSettings.field === SortFilterField.Type
          })} onClick={handleSortBy(SortFilterField.Type)}>
            Type
          </button>
          {[SortFilterField.Status, SortFilterField.Type].includes(sortFilterSettings.field) ?
            (sortFilterSettings.desc ? <ExpandMore/> : <ExpandLess/>) :
            <UnfoldMore/>
          }
          </div>
        </div>
        <form className={classNames(classes.searchWrapper, 'flippable', isSearching ? 'front' : 'back')} onSubmit={handleSubmitSearch}>
          <Input classes={classes} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} aria-label={'Search'}/>
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
