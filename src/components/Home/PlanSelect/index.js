import React, { useState, useCallback, useEffect } from 'react';
import Select from '../../General/Select';
import CreatePlanComponent from './components/CreatePlanComponent';
import useApp from '../../../hooks/useApp'; 
import { ACTION_TYPES } from '../../../reducers';

const HOME_NAME = 'Home';
export const CREATE_NEW_PLAN = 'Create Plan';

export const PlanSelect = ({ classes, plans, creatingPlan }) => {
  const [currentPlan, setCurrentPlan] = useState(HOME_NAME);
  const planOptions = [HOME_NAME, ...plans, CREATE_NEW_PLAN];
  const { history, dispatch } = useApp();

  const setCreatingPlan = useCallback(creating => dispatch({
    type: ACTION_TYPES.CREATING_PLAN,
    payload: creating,
  }), []);

  const handleChange = useCallback(e => {
    const value = e.target.value;
    setCurrentPlan(value);
    switch (value) {
      case 'Create Plan':
        setCreatingPlan(true);
        break;
    
      default:
        break;
    }
  }, []);

  const handleClose = useCallback(() => {
    setCreatingPlan(false);
    setCurrentPlan(HOME_NAME);
  }, []);

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
        />
      )}
    />
  );
};

export default PlanSelect;