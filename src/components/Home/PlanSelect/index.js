import React, { useState, useCallback } from 'react';
import Select from '../../General/Select';
import CreatePlanComponent from './components/CreatePlanComponent';

const HOME_NAME = 'Home';
export const CREATE_NEW_PLAN = 'Create Plan';

export const PlanSelect = ({ classes, plans }) => {
  const [currentPlan, setCurrentPlan] = useState(HOME_NAME);
  const [creatingPlan, setCreatingPlan] = useState(false);
  const planOptions = [HOME_NAME, ...plans, CREATE_NEW_PLAN];

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
        />
      )}
    />
  );
};

export default PlanSelect;