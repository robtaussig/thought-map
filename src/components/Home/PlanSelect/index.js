import React, { useState, useCallback, useEffect, useRef } from 'react';
import Select from '../../General/Select';
import CreatePlanComponent from './components/CreatePlanComponent';
import useApp from '../../../hooks/useApp'; 
import { ACTION_TYPES } from '../../../reducers';
import { homeUrl } from '../../../lib/util';

const HOME_NAME = 'Home';
export const CREATE_NEW_PLAN = 'Create Plan';

export const PlanSelect = ({ classes, plans, creatingPlan, thoughts, planId }) => {
  const [currentPlan, setCurrentPlan] = useState(HOME_NAME);
  const lastPlan = useRef(HOME_NAME);
  const planOptions = [HOME_NAME, ...plans.map(toName), CREATE_NEW_PLAN];
  const { history, dispatch } = useApp();

  const setCreatingPlan = useCallback(creating => dispatch({
    type: ACTION_TYPES.CREATING_PLAN,
    payload: creating,
  }), []);

  const handleChange = useCallback(e => {
    const value = e.target.value;
    lastPlan.current = currentPlan;
  
    setCurrentPlan(value);
    switch (value) {
      case 'Create Plan':
        setCreatingPlan(true);
        break;

      case 'Home':
        history.push('/');
        break;
    
      default:
        const plan = plans.find(({ name }) => name === value);
        if (plan) {
          history.push(`/plan/${plan.id}/`);
        } else {
          console.error('plan not found');
        }
        break;
    }
  }, [plans, thoughts, currentPlan]);

  const handleClose = useCallback(() => {
    setCurrentPlan(lastPlan.current);
    setCreatingPlan(false);
  }, []);

  useEffect(() => {
    const foundPlan = plans.find(({ id }) => id === planId);
    if (planId && foundPlan) {
      setCurrentPlan(foundPlan.name);
    }
  }, [planId, plans]);

  return (
    <Select
      id={'plans'}
      classes={classes}
      value={currentPlan}
      options={planOptions}
      onChange={handleChange}
      injectedComponent={(
        <CreatePlanComponent
          open={creatingPlan}
          onClose={handleClose}
          thoughts={thoughts}
        />
      )}
    />
  );
};

const toName = plan => plan.name;

export default PlanSelect;