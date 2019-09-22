import React, { useCallback, useMemo, FC } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Content from './Content/index';
import Build from '@material-ui/icons/Build';
import PlanSelect from './PlanSelect';
import CreateThought from '../CreateThought';
import CircleButton from '../General/CircleButton';
import { styles } from './styles';
import useApp from '../../hooks/useApp';
import useModal from '../../hooks/useModal';
import { getIdFromUrl } from '../../lib/util';
import { AppState } from '../../reducers';
import { Notification } from '../../types';

interface HomeProps {
  classes: any;
  state: AppState;
  statusOptions: string[];
  setLastNotification: (notification: Notification) => void;
  typeOptions: string[];
  tagOptions: string[];
}

export const Home: FC<HomeProps> = ({ classes, state, statusOptions, setLastNotification, typeOptions, tagOptions }) => {
  const { history } = useApp();
  const [openModal, closeModal, expandModal] = useModal();
  const planId = getIdFromUrl(history, 'plan');
  const handleAddThought = () => openModal(
    <CreateThought
      onExpand={expandModal}
      onClose={closeModal}
      typeOptions={typeOptions}
      tagOptions={tagOptions}
    />
  );
  const handleEditPlan = useCallback(() => planId ? history.push(`/plan/${planId}/settings?type=plan`) : history.push(`/settings`), [planId]);
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
      <Content classes={classes} thoughts={thoughts} notes={state.notes} tags={state.tags} plan={plan} statusOptions={statusOptions}/>
      <PlanSelect classes={classes} plans={state.plans} thoughts={thoughts} planId={planId} setLastNotification={setLastNotification}/>
      {<CircleButton id={'edit-plan'} classes={classes} onClick={handleEditPlan} label={'Edit Plan'} Icon={Build}/>}
      {<CircleButton id={'add-thought'} classes={classes} onClick={handleAddThought} label={'Add Thought'}/>}
    </div>
  );
};

export default withStyles(styles)(Home);
