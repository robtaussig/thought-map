import React, { useRef, FC, EventHandler, MutableRefObject, memo, useMemo } from 'react';
import ThoughtNode from './ThoughtNode';
import { Plan } from '~store/rxdb/schemas/plan';
import { Thought } from '~store/rxdb/schemas/thought';
import { Graph } from './lib/graph';
import { ThoughtConnections } from './types';
import { SortFilterSettings } from '../../../reducers/sortFilterSettings';

interface ThoughtNodesProps {
  classes: any;
  thoughts: Thought[];
  matchingThoughts: string[];
  plan: Plan;
  thoughtMap: MutableRefObject<Graph>;
  sortFilterSettings: SortFilterSettings;
  plans: Plan[];
  didMount: MutableRefObject<boolean>;
  setShowFilters: (show: boolean) => void;
  statusOptions: string[];
  typeOptions: string[];
  from: string;
  connectionStatusByThought: ThoughtConnections;
}

export const ThoughtNodes: FC<ThoughtNodesProps> = ({
  classes,
  thoughts,
  matchingThoughts,
  plan,
  thoughtMap,
  sortFilterSettings,
  plans,
  didMount,
  setShowFilters,
  statusOptions,
  typeOptions,
  from,
  connectionStatusByThought,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const lastScrollPos = useRef<number>(0);
  const planNamesById = plans.reduce((next, statePlan) => {
    next[statePlan.id] = statePlan.name;
    return next;
  }, {} as { [planId: string]: string });

  const handleScroll: EventHandler<any> = (e: { target: HTMLDivElement }) => {
    if (didMount.current === true) {
      const scrollTop = e.target.scrollTop;
      setShowFilters(scrollTop < lastScrollPos.current);
      lastScrollPos.current = scrollTop;
    }
  };

  const sortedAndFiltered = useMemo(() => {
    const filterMatchedThoughts = (thought: Thought) =>
      matchingThoughts.includes(thought.id);

    const filterCompletedThoughts = (thought: Thought) =>
      (plan && plan.showCompleted) || 
      (thought.status !== 'completed' && thought.status !== 'won\'t fix');

    const filterChildrenThoughts = (thought: Thought) =>
      plan?.groupThoughts !== true ||
      thoughtMap.current.isRoot(thought.id);

    const filterHiddenThoughts = (thought: Thought) =>
      Boolean(plan) || thought.hideFromHomeScreen !== true;
      
    const combinedFilters = (thought: Thought): boolean =>
      matchingThoughts ?
        filterMatchedThoughts(thought) :
        (filterCompletedThoughts(thought) &&
        filterChildrenThoughts(thought) &&
        filterHiddenThoughts(thought));

    const sortBySortRule = (left: Thought, right: Thought): number => {
      if (sortFilterSettings.field) {
        const leftIsBigger = left[sortFilterSettings.field] &&
          (!right[sortFilterSettings.field] || (left[sortFilterSettings.field].toLowerCase() > right[sortFilterSettings.field].toLowerCase()));
        
        return (leftIsBigger && sortFilterSettings.desc) || (!leftIsBigger && !sortFilterSettings.desc) ? 1 : -1;
      }
      return 1;
    };

    return thoughts
      .filter(combinedFilters)
      .sort(sortBySortRule);
  }, [matchingThoughts, thoughts, plan, plan, thoughtMap, sortFilterSettings.field, sortFilterSettings.desc]);

  return (
    <div className={classes.content} ref={rootRef} onScroll={handleScroll}>
      {sortedAndFiltered
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
        })}
    </div>
  );
};

export default memo(ThoughtNodes);
