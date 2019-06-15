import React, { useCallback, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Content from './Content/index';
import Check from '@material-ui/icons/Check';
import PlanSelect from './PlanSelect';
import Header from './Header';
import CircleButton from '../General/CircleButton';
import { styles } from './styles';
import useApp from '../../hooks/useApp';


export const Home = ({ classes, state }) => {
  const { history, dispatch } = useApp();
  const { inputtedPlan } = state;
  const handleAddThought = useCallback(() => history.push('/thought/new'), []);
  const handleClickSettings = useCallback(() => history.push('/settings'),[]);
  const handleCreatePlan = useCallback(() => console.log('hit'),[]);
  
  return (
    <div className={classes.root}>
      <Content classes={classes} thoughts={state.thoughts} connections={state.connections}/>
      <PlanSelect classes={classes} plans={state.plans} creatingPlan={state.creatingPlan}/>
      <Header classes={classes}/>
      {state.creatingPlan ?
        (<CircleButton id={'create-plan'} classes={classes} onClick={handleCreatePlan} disabled={inputtedPlan === ''} label={'Create Plan'} Icon={Check}/>) :
        (<CircleButton classes={classes} onClick={handleAddThought} label={'Add Thought'}/>)
      }
    </div>
  );
};

export default withStyles(styles)(Home);
