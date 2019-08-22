import React, { useCallback, useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Content from './Content/index';
import Build from '@material-ui/icons/Build';
import Search from '@material-ui/icons/Search';
import ThoughtSearch from './ThoughtSearch';
import PlanSelect from './PlanSelect';
import CircleButton from '../General/CircleButton';
import { styles } from './styles';
import useApp from '../../hooks/useApp';
import { getIdFromUrl } from '../../lib/util';
import useModal from '../../hooks/useModal';

export const Home = ({ classes, state }) => {
  const { history, dispatch } = useApp();
  const [openModal, closeModal] = useModal();
  const planId = getIdFromUrl(history, 'plan');
  const handleAddThought = useCallback(() => history.push(planId ? `/plan/${planId}/thought/new` :'/thought/new'), [planId]);
  const handleEditPlan = useCallback(() => planId ? history.push(`/plan/${planId}/settings?type=plan`) : history.push(`/settings`), [planId]);
  const handleSearch = useCallback(() => openModal(
    <ThoughtSearch thoughts={state.thoughts} notes={state.notes} tags={state.tags} close={closeModal}/>
  ),[state]);
  const plan = state.plans.find(plan => plan.id === planId);
  const thoughts = useMemo(() => {
    if (planId) {
      return state.thoughts.filter(thought => thought.planId === planId);
    } else {
      return state.thoughts;
    }
  }, [planId, state.thoughts]);

  return (
    <div className={classes.root}>
      <Content classes={classes} thoughts={thoughts} plan={plan}/>
      <PlanSelect classes={classes} plans={state.plans} creatingPlan={state.creatingPlan} thoughts={thoughts} planId={planId}/>
      {!state.creatingPlan && <CircleButton id={'edit-plan'} classes={classes} onClick={handleEditPlan} label={'Edit Plan'} Icon={Build}/>}
      {!state.creatingPlan && <CircleButton id={'search'} classes={classes} onClick={handleSearch} label={'Search'} Icon={Search}/>}
      {!state.creatingPlan && <CircleButton id={'add-thought'} classes={classes} onClick={handleAddThought} label={'Add Thought'}/>}
    </div>
  );
};

export default withStyles(styles)(Home);
