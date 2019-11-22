import React, { useCallback, useMemo, FC, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Content from './Content/index';
import Build from '@material-ui/icons/Build';
import PlanSelect from './PlanSelect';
import CreateThought from '../CreateThought';
import CircleButton from '../General/CircleButton';
import { styles } from './styles';
import useApp from '../../hooks/useApp';
import useModal from '../../hooks/useModal';
import { getIdFromUrl, getSearchParam } from '../../lib/util';
import { Notification } from '../../types';
import PlanSelectActions from './PlanSelect/components/actions';
import { planSelector } from '../../reducers/plans';
import { thoughtSelector } from '../../reducers/thoughts';
import { useSelector } from 'react-redux';

interface HomeProps {
  classes: any;
  statusOptions: string[];
  setLastNotification: (notification: Notification) => void;
  typeOptions: string[];
}

export const Home: FC<HomeProps> = ({ classes, statusOptions, setLastNotification, typeOptions }) => {
  const { history } = useApp();
  const [openModal, closeModal] = useModal();
  const plans = useSelector(planSelector);
  const thoughts = useSelector(thoughtSelector);
  const planId = getIdFromUrl(history, 'plan');
  const from = getSearchParam(history, 'from');
  const handleAddThought = () => {
    openModal(
      <CreateThought
        onClose={closeModal}
        typeOptions={typeOptions}
      />, 'Create Thought'
    );
  }
  const handleEditPlan = useCallback(() => planId ? history.push(`/plan/${planId}/settings?type=plan`) : history.push(`/settings`), [planId]);
  const plan = plans.find(plan => plan.id === planId);
  const planThoughts = useMemo(() => {
    if (planId) {
      return thoughts.filter(thought => thought.planId === planId);
    } else {
      return thoughts;
    }
  }, [planId, thoughts]);
  
  return (
    <div className={classes.root}>
      <Content
        classes={classes}
        thoughts={planThoughts}
        plan={plan}
        statusOptions={statusOptions}
        typeOptions={typeOptions}
        from={from}
      />
      <PlanSelect classes={classes} plans={plans} thoughts={planThoughts} planId={planId} setLastNotification={setLastNotification}/>
      <CircleButton
        id={'edit-plan'}
        classes={classes}
        onClick={handleEditPlan}
        label={'Edit Plan'}
        Icon={Build}
        onLongPress={() => {
          openModal(
            <PlanSelectActions
              planId={planId}
              onClose={closeModal}
            />
          );
        }}
      />
      <CircleButton
        id={'add-thought'}
        classes={classes}
        onClick={handleAddThought}
        label={'Add Thought'}
      />
    </div>
  );
};

export default withStyles(styles)(Home);
