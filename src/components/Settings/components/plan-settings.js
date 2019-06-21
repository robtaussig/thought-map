import React, { useState, useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles'; 
import CircleButton from '../../General/CircleButton';
import Input from '../../General/Input';
import CheckBox from '../../General/CheckBox';
import Select from '../../General/Select';
import Home from '@material-ui/icons/Home';
import Check from '@material-ui/icons/Check';
import DeletePlan from './delete-plan';
import useApp from '../../../hooks/useApp';
import { useLoadedDB } from '../../../hooks/useDB';
import { plans as planActions, thoughts as thoughtActions } from '../../../actions';
import { planSettingsStyles } from '../styles';

export const PlanSettings = ({ classes, plan, thoughts }) => {
  const { history } = useApp();
  const db = useLoadedDB();
  const [inputtedName, setInputtedName] = useState(plan.name);
  const [isDefault, setIsDefault] = useState(Boolean(plan.isDefault));
  const [hasChange, setHasChange] = useState(false);
  const canAddThoughts = useMemo(() => {
    return [{ label: 'Add Thought' }].concat(thoughts.filter(thought => {
                            return thought.planId !== plan.id;
                          })
                          .map((thought, idx) => ({id: thought.id, label: `${idx + 1} - ${thought.title}`})));
  }, [thoughts, plan]);
  const canRemoveThoughts = useMemo(() => {
    return [{ label: 'Remove Thought' }].concat(thoughts.filter(thought => {
                                return thought.planId === plan.id;
                              })
                              .map((thought, idx) => ({id: thought.id, label: `${idx + 1} - ${thought.title}`})));
  }, [thoughts, plan]);

  const handleClickReturnHome = () => history.push(`/plan/${plan.id}`);

  const handleClickSubmitChanges = async () => {
    const editedPlan = Object.assign({}, plan, {
      name: inputtedName,
      //Default status
    });
    await planActions.editPlan(db, editedPlan);
    setHasChange(false);
  };

  const handleCheckDefault = e => {
    setHasChange(true);
    setIsDefault(e.target.checked);
  };

  const handleAddThought = e => {
    const { value } = e.target;
    const [oneIndex] = value.split(' - ');
    const thoughtToAdd = canAddThoughts[Number(oneIndex)];
    const thought = thoughts.find(foundThought => foundThought.id === thoughtToAdd.id);
    const nextThought = Object.assign({}, thought, {
      planId: plan.id,
    });
    thoughtActions.editThought(db, nextThought);
  };

  const handleRemoveThought = e => {
    const { value } = e.target;
    const [oneIndex] = value.split(' - ');
    const thoughtToRemove = canRemoveThoughts[Number(oneIndex)];
    const thought = thoughts.find(foundThought => foundThought.id === thoughtToRemove.id);
    const nextThought = Object.assign({}, thought, {
      planId: '',
    });
    thoughtActions.editThought(db, nextThought);
  };

  const handleInputName = e => {
    setHasChange(true);
    setInputtedName(e.target.value);
  };

  return (
    <article className={classes.root}>
      <Input
        id={'plan-name'}
        classes={classes}
        value={inputtedName}
        onChange={handleInputName}
      />
      <CheckBox
        id={'default-plan'}
        classes={classes}
        isChecked={isDefault}
        value={'Default Plan'}
        onChange={handleCheckDefault}
        label={'Default Plan'}
      />
      <Select
        id={'add-thoughts'}
        classes={classes}
        value={'Add Thought'}
        options={canAddThoughts.map(({ label }) => label)}
        onChange={handleAddThought}
      />
      <Select
        id={'remove-thoughts'}
        classes={classes}
        value={'Remove Thought'}
        options={canRemoveThoughts.map(({ label }) => label)}
        onChange={handleRemoveThought}
      />
      <DeletePlan
        classes={classes}
        plan={plan}
      />
      <CircleButton
        classes={classes}
        id={'return-home'}
        onClick={handleClickReturnHome}
        label={'Return Home'}
        Icon={Home}
      />
      <CircleButton
        classes={classes}
        id={'submit-changes'}
        disabled={hasChange === false}
        onClick={handleClickSubmitChanges}
        label={'Submit'}
        Icon={Check}
      />
    </article>
  );
};

export default withStyles(planSettingsStyles)(PlanSettings);
