import React, { FC, useState } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import Select from '../../../General/Select';
import { ReviewPeriods } from '../types';
import Review from './review';
import { useSelector } from 'react-redux';
import { planSelector } from '../../../../reducers/plans';
import { thoughtSelector } from '../../../../reducers/thoughts';
import { statusesByThoughtSelector } from '../../../../reducers/statusesByThought';
import { statusSelector } from '../../../../reducers/statuses';

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
  const [currentReviewPeriod, setCurrentReviewPeriopd] = useState<ReviewPeriods>(ReviewPeriods.Week);
  const plans = useSelector(planSelector);
  const stateThoughts = useSelector(thoughtSelector);
  const statusesByThought = useSelector(statusesByThoughtSelector);
  const statuses = useSelector(statusSelector);
  const plan = plans.find(({ id }) => id === planId);
  const thoughts = stateThoughts.filter(thought => typeof planId === 'boolean' || thought.planId === planId);

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
        statusesByThought={statusesByThought}
        statuses={statuses}
      />
    </div>
  );
};

export default withStyles(styles)(PlanSelectActions);
