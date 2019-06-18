import React, { useCallback, useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Content from './Content/index';
import Check from '@material-ui/icons/Check';
import PlanSelect from './PlanSelect';
import Header from './Header';
import CircleButton from '../General/CircleButton';
import { styles } from './styles';
import useApp from '../../hooks/useApp';
import { getIdFromUrl } from '../../lib/util';


export const Home = ({ classes, state }) => {
  const { history, dispatch } = useApp();
  const handleClickSettings = useCallback(() => history.push('/settings'),[]);
  const planId = getIdFromUrl(history, 'plan');
  const handleAddThought = useCallback(() => history.push(planId ? `/plan/${planId}/thought/new` :'/thought/new'), [planId]);
  const thoughts = useMemo(() => {
    if (planId) {
      return state.thoughts.filter(thought => thought.planId === planId);
    } else {
      return state.thoughts;
    }
  }, [planId, state.thoughts]);

  return (
    <div className={classes.root}>
      <Content classes={classes} thoughts={thoughts} connections={state.connections}/>
      <PlanSelect classes={classes} plans={state.plans} creatingPlan={state.creatingPlan} thoughts={thoughts} planId={planId}/>
      <Header classes={classes}/>
      {!state.creatingPlan && <CircleButton classes={classes} onClick={handleAddThought} label={'Add Thought'}/>}
    </div>
  );
};

export default withStyles(styles)(Home);
