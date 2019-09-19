import React, { useCallback, useMemo, FC } from 'react';
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
import { AppState } from '../../reducers';

interface HomeProps {
  classes: any;
  state: AppState;
  statusOptions: string[];
}

export const Home: FC<HomeProps> = ({ classes, state, statusOptions }) => {
  const { history } = useApp();
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
      <Content classes={classes} thoughts={thoughts} plan={plan} statusOptions={statusOptions}/>
      <PlanSelect classes={classes} plans={state.plans} thoughts={thoughts} planId={planId}/>
      {<CircleButton id={'edit-plan'} classes={classes} onClick={handleEditPlan} label={'Edit Plan'} Icon={Build}/>}
      {<CircleButton id={'search'} classes={classes} onClick={handleSearch} label={'Search'} Icon={Search}/>}
      {<CircleButton id={'add-thought'} classes={classes} onClick={handleAddThought} label={'Add Thought'}/>}
    </div>
  );
};

export default withStyles(styles)(Home);
