import React, { FC, Fragment, useEffect } from 'react';
import Input from '../General/Input';
import Select from '../General/Select';
import { CreatedThought } from './';
import { Plan } from '../../store/rxdb/schemas/plan';

interface InputsProps {
  classes: any;
  createdThought: CreatedThought;
  setCreatedThought: (setter: ((prev: CreatedThought) => CreatedThought)) => void;
  typeOptions: string[];
  onReady: (ready: boolean) => void;
  thoughtTitles: string[];
  planId: string | boolean;
  plans: Plan[];
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
}

const Inputs: FC<InputsProps> = ({
  classes,
  createdThought,
  setCreatedThought,
  typeOptions,
  thoughtTitles,
  onReady,
  planId,
  plans,
  selectedPlan,
  setSelectedPlan,
}) => {
  const setTitle = (value: string) => setCreatedThought(prev => ({
    ...prev,
    title: value,
  }));
  const setType = (value: string) => setCreatedThought(prev => ({
    ...prev,
    type: value,
  }));

  const isReady = validateInputs(createdThought.title);

  useEffect(() => {
    onReady(isReady);
  }, [isReady]);

  return (
    <Fragment>
      <Input classes={classes} id={'title'} value={createdThought.title} onChange={e => setTitle(e.target.value)} autoSuggest={thoughtTitles} autoFocus/>
      <Select classes={classes} id={'type'} value={createdThought.type} options={typeOptions} onChange={e => setType(e.target.value)}/>
      {!planId &&(
        <Select
          classes={classes}
          id={'plan'}
          value={selectedPlan}
          options={['Plan'].concat(plans.map(({ name }) => name))}
          onChange={e => setSelectedPlan(e.target.value)}
        />
      )}
    </Fragment>
  );
};

export default Inputs;

const validateInputs = (title: string): boolean => {
  return title !== '';
};
