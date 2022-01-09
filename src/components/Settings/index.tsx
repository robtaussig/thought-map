import React, { useMemo, useCallback, FC } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading';
import { getIdFromUrl, getSearchParam } from '../../lib/util';
import NavBar from './components/nav-bar';
import PlanSettings from './components/plan-settings';
import AppSettings from './components/app-settings';
import { rootStyles } from './styles';
import { useSelector } from 'react-redux';
import { planSelector } from '../../reducers/plans';
import { thoughtSelector } from '../../reducers/thoughts';
import { connectionSelector } from '../../reducers/connections';

interface SettingsProps {
  classes: any;
  typeOptions: string[];
  setLastNotification: (notification: { message: string }) => void;
}

interface NavBarItem {
  value: string;
  current: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const Settings: FC<SettingsProps> = ({ classes, typeOptions, setLastNotification }) => {
  const navigate = useNavigate();
  const planId = getIdFromUrl('plan');
  const type = getSearchParam('type');

  const plans = useSelector(planSelector);
  const thoughts = useSelector(thoughtSelector);
  const connections = useSelector(connectionSelector);

  const plan = useMemo(() => plans.find(({ id }) => id === planId), [plans, planId]);
  const handleClick = useCallback(type => () => {
    navigate(`?type=${type}`);
  }, []);

  const items = useMemo(() => {
    const returnValue: NavBarItem[] = [{
      value: 'App',
      current: type !== 'plan',
      onClick: handleClick('app'),
      disabled: !planId,
    }];
    if (planId) returnValue.unshift({
      value: 'Plan',
      current: type === 'plan',
      onClick: handleClick('plan'),
    });
  
    return returnValue;
  }, [planId, type]);

  return (
    <div className={classes.root}>
      <NavBar
        items={items}
      />
      {type === 'plan' ? (
        plan ? 
          <PlanSettings
            plan={plan}
            thoughts={thoughts}
            typeOptions={typeOptions}
            connections={connections}
          /> :
          <Loading id={'thought-loader'}/>
      ) : (
        <AppSettings setLastNotification={setLastNotification}/>
      )}
    </div>
  );
};

export default withStyles(rootStyles)(Settings);
