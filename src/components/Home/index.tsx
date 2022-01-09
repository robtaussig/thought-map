import React, { useMemo, FC } from 'react';
import Content from './Content/index';
import PlanSelect from './PlanSelect';
import { useStyles } from './styles';
import { getIdFromUrl, getSearchParam } from '../../lib/util';
import { Notification } from '../../types';
import { planSelector } from '../../reducers/plans';
import { thoughtSelector } from '../../reducers/thoughts';
import { useSelector } from 'react-redux';

interface HomeProps {
  statusOptions: string[];
  setLastNotification: (notification: Notification) => void;
  typeOptions: string[];
}

export const Home: FC<HomeProps> = ({ statusOptions, setLastNotification, typeOptions }) => {
  const plans = useSelector(planSelector);
  const classes = useStyles();
  const thoughts = useSelector(thoughtSelector);
  const planId = getIdFromUrl('plan');
  const from = getSearchParam('from');
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
      <Content
        classes={classes}
        thoughts={planThoughts}
        plan={plan}
        statusOptions={statusOptions}
        typeOptions={typeOptions}
        from={from}
      />
      <PlanSelect classes={classes} plans={plans} thoughts={planThoughts} planId={planId} setLastNotification={setLastNotification}/>
    </div>
  );
};

export default Home;
