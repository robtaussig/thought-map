import React, { useState, useCallback, useEffect, useRef, FC } from 'react';
import Select from '../../General/Select';
import { useModal } from '../../../hooks/useModal';
import useApp from '../../../hooks/useApp'; 
import CreatePlan from './components/create';
import { Thought } from 'store/rxdb/schemas/thought';
import { Plan } from 'store/rxdb/schemas/plan';
import { Notification } from '../../../types';
import PriorityList from '../../Home/PriorityList/';

interface PlanSelectProps {
  classes: any;
  plans: Plan[];
  thoughts: Thought[];
  planId: string | boolean;
  setLastNotification: (notification: Notification) => void;
}

const HOME_NAME = 'ThoughtMap';
const SHOW_ARCHIVED = 'Show Archived';
const HIDE_ARCHIVED = 'Hide Archived';
const PRIORITIES = 'Priorities';

export const CREATE_NEW_PLAN = 'Create Plan';

export const PlanSelect: FC<PlanSelectProps> = ({ classes, plans, thoughts, planId, setLastNotification }) => {
  const [currentPlan, setCurrentPlan] = useState<string>(HOME_NAME);
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [showPriorities, setShowPriorities] = useState<boolean>(false);
  const [openModal, closeModal] = useModal();
  const lastPlan = useRef<string>(HOME_NAME);
  const planOptions = [
    PRIORITIES,
    HOME_NAME,
    ...[...new Set(plans.filter(hideOrShowArchived(showArchived)).map(toName))],
    showArchived ? HIDE_ARCHIVED : SHOW_ARCHIVED,
    CREATE_NEW_PLAN
  ];
  const { history, dispatch } = useApp();

  const onClosePriorityList = useCallback(() => {
    setShowPriorities(false);
  }, []);

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

      case HIDE_ARCHIVED:
        setLastNotification({ message: 'Hiding archived plans' });
        setShowArchived(false);
        setCurrentPlan(lastPlan.current);
        break;

      case SHOW_ARCHIVED:
        setLastNotification({ message: 'Showing archived plans' });
        setShowArchived(true);
        setCurrentPlan(lastPlan.current);
        break;

      case HOME_NAME:
        history.push('/');
        break;

      case PRIORITIES:
          setShowPriorities(true);
          setCurrentPlan(lastPlan.current);
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
    <>
      <Select
        id={'plans'}
        classes={classes}
        value={currentPlan}
        options={planOptions}
        onChange={handleChange}
        ariaLabel={'Select Plan'}
      />
      {showPriorities && <PriorityList thoughts={thoughts} onClose={onClosePriorityList}/>}
    </>
  );
};

const toName = (plan: Plan) => plan.name;
const hideOrShowArchived = (showArchived: boolean) => (plan: Plan) => showArchived || !plan.archived;

export default PlanSelect;
