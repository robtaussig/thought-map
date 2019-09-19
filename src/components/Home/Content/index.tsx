import React, { useRef, FC, Fragment, useState } from 'react';
import ThoughtNode from './ThoughtNode';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import { Plan } from '~store/rxdb/schemas/plan';
import { Thought } from '~store/rxdb/schemas/thought';

interface ContentProps {
  classes: any;
  thoughts: Thought[];
  plan: Plan;
}

type Field = 'name' | 'status';

interface SortRule {
  field?: Field;
  desc?: boolean;
}

export const Content: FC<ContentProps> = React.memo(({ classes, thoughts, plan }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [sortRule, setSortRule] = useState<SortRule>({});

  const sortBySortRule = (left: Thought, right: Thought): number => {
    if (sortRule.field) {
      const leftIsBigger = sortRule.field === 'name' ?
        left.title.toLowerCase() > right.title.toLowerCase():
        left.status.toLowerCase() > right.status.toLowerCase();
      
      return (leftIsBigger && sortRule.desc) || (!leftIsBigger && !sortRule.desc) ? 1 : -1;
    }
    return 1;
  };

  const filterCompletedThoughts = (thought: Thought) => (plan && plan.showCompleted) || thought.status !== 'completed';

  const handleSortBy = (name: Field) => () => setSortRule(({ field, desc }) => ({
    field: field === name && desc === false ? null : name,
    desc: field === name ?
      desc === false ? null : !desc :
      true
  }));

  return (
    <Fragment>
      <div className={classes.sortByButtons}>
        <div className={classes.sortByNames}>
          <button className={classes.sortButton} onClick={handleSortBy('name')}>Name</button>
          {sortRule.field === 'name' ?
            (sortRule.desc ? <ExpandMore/> : <ExpandLess/>) :
            <div className={classes.emptyIcon}/>
          }
        </div>
        <div className={classes.sortByStatus}>
        <button className={classes.sortButton} onClick={handleSortBy('status')}>Status</button>
          {sortRule.field === 'status' ?
            (sortRule.desc ? <ExpandMore/> : <ExpandLess/>) :
            <div className={classes.emptyIcon}/>
          }
        </div>
      </div>
      <div className={classes.content} ref={rootRef}>
        {thoughts
          .filter(filterCompletedThoughts)
          .sort(sortBySortRule)
          .map(thought => {
            return (
              <ThoughtNode
                classes={classes}
                key={`thought-node-${thought.id}`}  
                thought={thought}
              />
            );
          })}
      </div>
    </Fragment>
  );
});

export default Content;
