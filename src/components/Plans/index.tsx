import React, { FC, memo, useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import cn from 'classnames';
import { useTypedSelector } from '../../reducers';
import Plan from './Plan';
import { thoughtSelector } from '../../reducers/thoughts';
import { sortPlansByLatestThought } from './util';

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flex: 1,
    background: theme.palette.background[600],
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    flex: 0,
    margin: 20,
    color: theme.palette.primary[300],
  },
  headerText: {
    fontSize: 20,
    fontWeight: 600,
  },
  showArchived: {
    marginLeft: 'auto',
  },
  planList: {
    flex: 1,
    overflow: 'auto',
    '& > *:first-child': {
      marginTop: 0,
    },
    '& > *': {
      margin: 20,
    }
  },
}));

export interface PlansProps {
  className?: string;
}

export const Plans: FC<PlansProps> = ({
  className,
}) => {
  const classes = useStyles();
  const plans = useTypedSelector(state => state.plans);
  const thoughts = useTypedSelector(thoughtSelector.selectAll);
  
  const plansSortedByLatestThought = useMemo(() => sortPlansByLatestThought(plans, thoughts), [thoughts, plans]);

  return (
    <div className={cn(classes.root, className)}>
      <header className={classes.header}>
        <h1 className={classes.headerText}>Plans</h1>
      </header>
      <ul className={classes.planList}>
        {plansSortedByLatestThought.map(({ plan, statusCount }) => (
          <Plan key={`${plan.id}-plan`} plan={plan} statusCount={statusCount} />
        ))}
      </ul>
    </div>
  );
};

export default memo(Plans);
