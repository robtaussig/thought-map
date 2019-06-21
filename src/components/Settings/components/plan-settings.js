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
import { planSettingsStyles } from '../styles';

export const PlanSettings = ({ classes, plan, thoughts }) => {
  const { history } = useApp();
  const [inputtedName, setInputtedName] = useState(plan.name);
  const [isDefault, setIsDefault] = useState(Boolean(plan.isDefault));
  const [hasChange, setHasChange] = useState(false);
  const canAddThoughts = useMemo(() => {
    return ['Add Thought'].concat(thoughts.filter(thought => {
                            return thought.planId !== plan.id;
                          })
                          .map((thought, idx) => `${idx + 1} - ${thought.title}`));
  }, [thoughts, plan]);
  const canRemoveThoughts = useMemo(() => {
    return ['Remove Thought'].concat(thoughts.filter(thought => {
                                return thought.planId === plan.id;
                              })
                              .map((thought, idx) => `${idx + 1} - ${thought.title}`));
  }, [thoughts, plan]);

  const handleClickReturnHome = () => history.push(`/plan/${plan.id}`);
  const handleClickSubmitChanges = () => console.log('changes');
  const handleCheckDefault = e => setIsDefault(e.target.checked);
  const handleAddThought = e => console.log(e.target.value);
  const handleRemoveThought = e => console.log(e.target.value);

  return (
    <article className={classes.root}>
      <Input
        id={'plan-name'}
        classes={classes}
        value={inputtedName}
        onChange={e => setInputtedName(e.target.value)}
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
        options={canAddThoughts}
        onChange={handleAddThought}
      />
      <Select
        id={'remove-thoughts'}
        classes={classes}
        value={'Remove Thought'}
        options={canRemoveThoughts}
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
