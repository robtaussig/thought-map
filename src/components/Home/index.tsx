import React, { useMemo, FC } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Content from './Content/index';
import PlanSelect from './PlanSelect';
import { styles } from './styles';
import useApp from '../../hooks/useApp';
import { getIdFromUrl, getSearchParam } from '../../lib/util';
import { Notification } from '../../types';
import { planSelector } from '../../reducers/plans';
import { thoughtSelector } from '../../reducers/thoughts';
import { useSelector } from 'react-redux';

interface HomeProps {
  classes: any;
  statusOptions: string[];
  setLastNotification: (notification: Notification) => void;
  typeOptions: string[];
}

export const Home: FC<HomeProps> = ({ classes, statusOptions, setLastNotification, typeOptions }) => {
  const { history } = useApp();
  const plans = useSelector(planSelector);
  const thoughts = useSelector(thoughtSelector);
  const planId = getIdFromUrl(history, 'plan');
  const from = getSearchParam(history, 'from');
  const plan = plans.find(plan => plan.id === planId);
  const planThoughts = useMemo(() => {
    if (planId) {
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

export default withStyles(styles)(Home);
