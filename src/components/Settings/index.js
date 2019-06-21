import React, { useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import useApp from '../../hooks/useApp';
import Loading from '../Loading';
import { getIdFromUrl, getSearchParam } from '../../lib/util';
import NavBar from './components/nav-bar';
import PlanSettings from './components/plan-settings';
import AppSettings from './components/app-settings';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.palette.gray[700],
  },
  nav: {
    display: 'flex',
    flex: '0 0 80px',
    boxShadow: '0px 3px 7px 2px black',
  },
  navItem: {
    flex: 1,
    fontSize: 24,
    backgroundColor: theme.palette.gray[200],
    '&.current': {
      backgroundColor: theme.palette.primary[500],
      boxShadow: '0px 0px 5px 0px black',
      zIndex: 1,
    },
    '&[disabled]': {
      color: 'black',
    },
  },  
});

export const Settings = ({ classes, state }) => {
  const { history } = useApp();
  const planId = getIdFromUrl(history, 'plan');
  const type = getSearchParam(history, 'type');
  const plan = state.plans.find(({ id }) => id === planId);
  const handleClick = type => () => {
    history.push(`?type=${type}`);
  };

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

export default withStyles(styles)(Settings);
