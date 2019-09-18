import React, { useMemo, useCallback, FC } from 'react';
import { withStyles } from '@material-ui/core/styles';
import useApp from '../../hooks/useApp';
import Loading from '../Loading';
import { getIdFromUrl, getSearchParam } from '../../lib/util';
import NavBar from './components/nav-bar';
import PlanSettings from './components/plan-settings';
import AppSettings from './components/app-settings';
import { rootStyles } from './styles';
import { AppState } from '../../reducers';

interface SettingsProps {
  classes: any;
  state: AppState;
}

interface NavBarItem {
  value: string;
  current: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const Settings: FC<SettingsProps> = ({ classes, state }) => {
  const { history } = useApp();
  const planId = getIdFromUrl(history, 'plan');
  const type = getSearchParam(history, 'type');
  const plan = useMemo(() => state.plans.find(({ id }) => id === planId), [state.plans, planId]);
  const handleClick = useCallback(type => () => {
    history.push(`?type=${type}`);
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
            thoughts={state.thoughts}
          /> :
          <Loading id={'thought-loader'}/>
      ) : (
        <AppSettings state={state}/>
      )}
    </div>
  );
};

export default withStyles(rootStyles)(Settings);
