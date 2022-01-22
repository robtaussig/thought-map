import React, { FC, memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import cn from 'classnames';
import { Plan as PlanType } from '../../../store/rxdb/schemas/plan';
import ArrowRight from '@material-ui/icons/ArrowRight';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'grid',
    gridTemplateAreas: `"title title arrow"
                        "not-started started completed"`,
    gridTemplateColumns: '1fr 1fr 1fr max-content',
    gridTemplateRows: '1fr 1fr',
    background: theme.palette.background[200],
    padding: 20,
    rowGap: 20,
    borderRadius: '10px',
    '&.archived': {
      opacity: 0.5,
    },
  },
  header: {
    gridArea: 'title',
    fontSize: 16,
    fontWeight: 600,
  },
  rightArrow: {
    gridArea: 'arrow',
    alignSelf: 'center',
    marginLeft: 'auto',
  },
  started: {
    gridArea: 'started',
    justifySelf: 'center'
  },
  notStarted: {
    gridArea: 'not-started',
  },
  completed: {
    gridArea: 'completed',
    justifySelf: 'end'
  },
  key: {
    marginRight: 5,
  },
  value: {
    fontWeight: 600,
  },
}));

export type StatusCount = { unstarted: number; started: number; completed: number };

export interface PlanProps {
  className?: string;
  plan: PlanType
  statusCount: StatusCount;
}

export const Plan: FC<PlanProps> = ({
  className,
  plan,
  statusCount,
}) => {
  const classes = useStyles();

  return (
    <Link className={cn(classes.root, className, { archived: plan.archived })} to={`/plan/${plan.id}/`}>
      <h2 className={classes.header}>{plan.name}</h2>
      <div className={classes.notStarted}>
        <span className={classes.key}>Not Started:</span>
        <span className={classes.value}>{statusCount.unstarted}</span>
      </div>
      <div className={classes.started}>
        <span className={classes.key}>Started:</span>
        <span className={classes.value}>{statusCount.started}</span>
      </div>
      <div className={classes.completed}>
        <span className={classes.key}>Completed:</span>
        <span className={classes.value}>{statusCount.completed}</span>
      </div>
      <ArrowRight className={classes.rightArrow}/>
    </Link>
  );
};

export default memo(Plan);
