import React, { useState, useCallback, useEffect, useRef, FC } from 'react';
import Select from '../../General/Select';
import { useModal } from '../../../hooks/useModal';
import useApp from '../../../hooks/useApp'; 
import CreatePlan from './components/create';
import { Thought } from 'store/rxdb/schemas/thought';
import { Plan } from 'store/rxdb/schemas/plan';

interface PlanSelectProps {
  classes: any;
  plans: Plan[];
  thoughts: Thought[];
  planId: string | boolean;
}

const HOME_NAME = 'ThoughtMap';
export const CREATE_NEW_PLAN = 'Create Plan';

export const PlanSelect: FC<PlanSelectProps> = ({ classes, plans, thoughts, planId }) => {
  const [currentPlan, setCurrentPlan] = useState<string>(HOME_NAME);
  const [openModal, closeModal] = useModal();
  const lastPlan = useRef<string>(HOME_NAME);
  const planOptions = [HOME_NAME, ...[...new Set(plans.map(toName))], CREATE_NEW_PLAN];
  const { history, dispatch } = useApp();

  const handleChange = useCallback(e => {
    const value = e.target.value;
    lastPlan.current = currentPlan;
  
    setCurrentPlan(value);
    switch (value) {
      case 'Create Plan':
        openModal(<CreatePlan
          onClose={closeModal}
        />);
        setCurrentPlan(lastPlan.current);
      break;

      case HOME_NAME:
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
    />
  );
};

const toName = (plan: Plan) => plan.name;

export default PlanSelect;
