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

const styles = theme => ({
  root: {
    flex: 1,
    display: 'grid',
    paddingBottom: '80px',
    margin: 20,
    gridTemplateAreas: `"plan-name plan-name"
                        "default-plan default-plan"
                        "add-thoughts add-thoughts"
                        "remove-thoughts remove-thoughts"
                        "delete-plan delete-plan"`,
    gridTemplateRows: '1fr 1fr 1fr 1fr 200px',
    gridTemplateColumns: 'max-content 1fr',
    gridRowGap: '20px',
  },
  inputLabel: {
    '&#plan-name': {
      gridArea: 'plan-name',
      display: 'flex',
      '& > *': {
        flex: 1,
      },
      '& input': {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        color: theme.palette.primary[500],
        fontSize: 24,
        border: 'none',
        borderBottom: `1px solid ${theme.palette.primary[500]}`,
      },
    },
  },
  selectLabel: {
    display: 'flex',
    border: `1px solid ${theme.palette.primary[500]}`,
    backgroundColor: theme.palette.gray[200],
    '& > select': {
      height: '100%',
      width: '100%',
      fontSize: 18,
    },
    '&#add-thoughts': {
      gridArea: 'add-thoughts',
    },
    '&#remove-thoughts': {
      gridArea: 'remove-thoughts',
    },
  },
  checkboxLabel: {
    ...theme.defaults.centered,
    justifyContent: 'flex-start',
    color: theme.palette.gray[300],
    '&#default-plan': {
      gridArea: 'default-plan',
    },
    '&#with-thoughts': {
      
    },
  },
  deletePlanSection: {
    gridArea: 'delete-plan',
    borderTop: `1px solid ${theme.palette.secondary[500]}`,
    display: 'flex',
    alignItems: 'center',
  },
  deletePlanButton: {
    marginRight: 20,
    border: `1px solid ${theme.palette.red[500]}`,
    backgroundColor: theme.palette.red[500],
    color: 'white',
    borderRadius: '4px',
    padding: '15px 30px',
  },
  circleButton: {
    ...theme.defaults.circleButton,
    '&#return-home': {
      bottom: 0,
      left: 0,
    },
    '&#submit-changes': {
      bottom: 0,
      right: 0,
    },
  },
});

export const PlanSettings = ({ classes, plan, thoughts }) => {
  const { history } = useApp();
  const [inputtedName, setInputtedName] = useState(plan.name);
  const [isDefault, setIsDefault] = useState(Boolean(plan.isDefault));
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

  const handleClickReturnHome = () => history.push('/');
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
        onClick={handleClickSubmitChanges}
        label={'Submit'}
        Icon={Check}
      />
    </article>
  );
};

export default withStyles(styles)(PlanSettings);
