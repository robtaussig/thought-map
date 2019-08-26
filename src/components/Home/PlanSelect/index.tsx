import React, { useState, useCallback, useEffect, useRef, FC } from 'react';
import Select from '../../General/Select';
import CreatePlanComponent from './components/CreatePlanComponent';
import useApp from '../../../hooks/useApp'; 
import { ACTION_TYPES } from '../../../reducers';
import { Thought } from 'store/rxdb/schemas/thought';
import { Plan } from 'store/rxdb/schemas/plan';

interface PlanSelectProps {
  classes: any,
  plans: Plan[],
  creatingPlan: boolean,
  thoughts: Thought[],
  planId: string | boolean,
}

const HOME_NAME = 'Home';
export const CREATE_NEW_PLAN = 'Create Plan';

export const PlanSelect: FC<PlanSelectProps> = ({ classes, plans, creatingPlan, thoughts, planId }) => {
  const [currentPlan, setCurrentPlan] = useState<string>(HOME_NAME);
  const lastPlan = useRef<string>(HOME_NAME);
  const planOptions = [HOME_NAME, ...[...new Set(plans.map(toName))], CREATE_NEW_PLAN];
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

  const handleClose = useCallback(planName => {
    if (planName) {
      setCurrentPlan(planName);
      lastPlan.current = planName;
    } else {
      setCurrentPlan(lastPlan.current);
    }
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
      ariaLabel={'Select Plan'}
      injectedComponent={(
        <CreatePlanComponent
          open={creatingPlan}
          onClose={handleClose}
          thoughts={thoughts}
          plans={plans}
        />
      )}
    />
  );
};

const toName = (plan: Plan) => plan.name;

export default PlanSelect;
