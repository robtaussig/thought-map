import React, { FC, memo, useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import cn from 'classnames';
import { useTypedSelector } from '../../reducers';
import Plan, { StatusCount } from './Plan';
import { Plan as PlanType } from '../../store/rxdb/schemas/plan';
import { thoughtSelector } from '../../reducers/thoughts';

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
  
  const plansSortedByLatestThought = useMemo(() => {
    const statusCounts: { [planId: string]: StatusCount } = {};
    const planIds: string[] = [];
    thoughts.forEach(({ planId, status }) => {
      if (!statusCounts[planId]) {
        planIds.push(planId);
        statusCounts[planId] = { unstarted: 0, started: 0, completed: 0 };
      }
      if (status === 'new') {
        statusCounts[planId].unstarted++;
      } else if (status === 'completed') {
        statusCounts[planId].completed++;
      } else if (status === 'in progress') {
        statusCounts[planId].started++;
      }
    });
    const planMap = plans.reduce<{ [planId: string]: PlanType }>((acc, plan) => {
      acc[plan.id] = plan;
      return acc;
    }, {});
    return planIds
      .reduce<{ plan: PlanType; statusCount: StatusCount }[]>((acc, planId) => {
        if (planMap[planId]) {
          acc.push({
            plan: planMap[planId],
            statusCount: statusCounts[planId],
          });
        }
        return acc;
      }, []);
  }, [thoughts, plans]);

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
