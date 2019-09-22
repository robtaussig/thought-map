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
import { Searchable, Notes, Tags } from '../ThoughtSearch';

interface ContentProps {
  classes: any;
  thoughts: Thought[];
  plan: Plan;
  notes: Notes;
  tags: Tags;
  statusOptions: string[];
}

type Field = 'name' | 'status';

interface SortRule {
  field?: Field;
  desc?: boolean;
}

export const Content: FC<ContentProps> = React.memo(({ classes, thoughts, plan, statusOptions, notes, tags }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const lastScrollPos = useRef<number>(0);
  const [sortRule, setSortRule] = useState<SortRule>({});
  const [scrollingUp, setScrollingUp] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [matchingThoughts, setMatchingThoughts] = useState<string[]>(null);
  const searchTree = useRef<Searchable>(new Searchable());

  const handleSortBy = (name: Field) => () => setSortRule(({ field, desc }) => ({
    field: field === name && desc === false ? null : name,
    desc: field === name ?
      desc === false ? null : !desc :
      true
  }));

  const thoughtComponents = useMemo(() => {
    const filterCompletedThoughts = (thought: Thought) => (plan && plan.showCompleted) || (thought.status !== 'completed' && thought.status !== 'won\'t fix');
    const filterMatchedThoughts = (thought: Thought) => {
      return matchingThoughts === null || matchingThoughts.includes(thought.id);
    };
    const sortBySortRule = (left: Thought, right: Thought): number => {
      if (sortRule.field) {
        const leftIsBigger = sortRule.field === 'name' ?
          left.title && (!right.title || (left.title.toLowerCase() > right.title.toLowerCase())):
          left.title && (!right.status || (left.status.toLowerCase() > right.status.toLowerCase()));
        
        return (leftIsBigger && sortRule.desc) || (!leftIsBigger && !sortRule.desc) ? 1 : -1;
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
          />
        );
      });
  }, [thoughts, plan, sortRule, matchingThoughts]);

  const handleScroll: EventHandler<any> = (e: { target: HTMLDivElement }) => {
    const scrollTop = e.target.scrollTop;
    setScrollingUp(scrollTop < lastScrollPos.current);
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

  const isSearching = scrollingUp === false || searchTerm !== '';

  return (
    <Fragment>
      <div className={classes.flippableWrapper}>
        <div className={classNames(classes.sortByButtons, 'flippable', isSearching ? 'back' : 'front')}>
          <div className={classes.sortByNames}>
            <button className={classes.sortButton} onClick={handleSortBy('name')}>
              Name
              {sortRule.field === 'name' ?
                (sortRule.desc ? <ExpandMore/> : <ExpandLess/>) :
                <UnfoldMore/>
              }  
            </button>
          </div>
          <div className={classes.sortByStatus}>
          <button className={classes.sortButton} onClick={handleSortBy('status')}>
            Status
            {sortRule.field === 'status' ?
              (sortRule.desc ? <ExpandMore/> : <ExpandLess/>) :
              <UnfoldMore/>
            }
          </button>
          </div>
        </div>
        <form className={classNames(classes.searchWrapper, 'flippable', isSearching ? 'front' : 'back')} onSubmit={handleSubmitSearch}>
          <Input classes={classes} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} aria-label={'Search'}/>
          <button className={classes.searchButton}><Search/></button>
        </form>
      </div>
      <div className={classes.content} ref={rootRef} onScroll={handleScroll}>
        {thoughtComponents}
      </div>
    </Fragment>
  );
});

export default Content;
