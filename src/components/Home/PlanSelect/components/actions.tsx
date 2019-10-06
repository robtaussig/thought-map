import React, { FC, useState } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { useModalDynamicState } from '../../../../hooks/useModal';
import Select from '../../../General/Select';
import { AppState } from '../../../../reducers';
import { ReviewPeriods } from '../types';
import Review from './review';

interface PlanSelectActionsProps {
  classes: any;
  planId: string | boolean;
  onClose: () => void;
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    fontWeight: 600,
    fontSize: 20,
  },
  subHeader: {
    margin: '15px 0',
    fontSize: 18,
    display: 'flex',
  },
  selectLabel: {
    margin: '0 5px',
    display: 'flex',
    '& select': {
      padding: '0 13px',
      textAlignLast: 'center',
      backgroundColor: theme.palette.primary[500],
      fontWeight: 600,
    },
  },
  reviewWrapper: {

  },
  reviewStat: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  reviewStatField: {
    fontWeight: 600,
  },
  reviewStatValue: {

  },
});

export const PlanSelectActions: FC<PlanSelectActionsProps> = ({ classes, planId, onClose }) => {
  const state: AppState = useModalDynamicState();
  const [currentReviewPeriod, setCurrentReviewPeriopd] = useState<ReviewPeriods>(ReviewPeriods.Week)
  const plan = state.plans.find(({ id }) => id === planId);
  const thoughts = state.thoughts.filter(thought => typeof planId === 'boolean' || thought.planId === planId);

  return (
    <div className={classes.root}>
      <h1 className={classes.header}>{typeof planId === 'boolean' ? 'ThoughtMap' : plan.name} ({thoughts.length} thoughts)</h1>
      <h2 className={classes.subHeader}>
        A
        {<Select
          classes={classes}
          value={currentReviewPeriod}
          options={[...new Set(Object.keys(ReviewPeriods))]}
          onChange={e => setCurrentReviewPeriopd(e.target.value as ReviewPeriods)}/>}
        In Review
      </h2>
      <Review
        classes={classes}
        thoughts={thoughts}
        reviewPeriod={currentReviewPeriod}
        statusesByThought={state.statusesByThought}
        statuses={state.statuses}
      />
    </div>
  );
};

export default withStyles(styles)(PlanSelectActions);
