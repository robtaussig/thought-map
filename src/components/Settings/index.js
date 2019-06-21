import React, { useMemo, useCallback } from 'react';
import { withStyles } from '@material-ui/core/styles';
import useApp from '../../hooks/useApp';
import Loading from '../Loading';
import { getIdFromUrl, getSearchParam } from '../../lib/util';
import NavBar from './components/nav-bar';
import PlanSettings from './components/plan-settings';
import AppSettings from './components/app-settings';
import { rootStyles } from './styles';

export const Settings = ({ classes, state }) => {
  const { history } = useApp();
  const planId = getIdFromUrl(history, 'plan');
  const type = getSearchParam(history, 'type');
  const plan = useMemo(() => state.plans.find(({ id }) => id === planId), [state.plans, planId]);
  const handleClick = useCallback(type => () => {
    history.push(`?type=${type}`);
  }, []);

  const items = useMemo(() => {
    const returnValue = [{
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
        classes={classes}
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
        <AppSettings
          classes={classes}
        />
      )}
    </div>
  );
};

export default withStyles(rootStyles)(Settings);
