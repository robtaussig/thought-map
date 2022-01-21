import React, { FC, useMemo } from 'react';
import Content from './Content/index';
import PlanSelect from './PlanSelect';
import { useStyles } from './styles';
import { useIdFromUrl, useSearchParam } from '../../lib/util';
import { planSelector } from '../../reducers/plans';
import { thoughtSelector } from '../../reducers/thoughts';
import { useSelector } from 'react-redux';

interface HomeProps {
  statusOptions: string[];
  typeOptions: string[];
}

export const Home: FC<HomeProps> = ({ statusOptions, typeOptions }) => {
  const plans = useSelector(planSelector);
  const classes = useStyles();
  const thoughts = useSelector(thoughtSelector);
  const planId = useIdFromUrl('plan');
  const from = useSearchParam('from');
  const plan = plans.find(plan => plan.id === planId);
  const planThoughts = useMemo(() => {
    if (planId === 'archive') {
      throw new Error('Not implemented');
    } else if (planId) {
      return thoughts.filter(thought => thought.planId === planId);
    } else {
      return thoughts;
    }
  }, [planId, thoughts]);

  return (
    <div className={classes.root}>
      <PlanSelect plan={plan} />
      <Content
        classes={classes}
        thoughts={planThoughts}
        plan={plan}
        statusOptions={statusOptions}
        typeOptions={typeOptions}
        from={from}
      />
    </div>
  );
};

export default Home;
