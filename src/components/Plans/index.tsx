import React, { FC, memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import cn from 'classnames';
import { useTypedSelector } from '../../reducers';
import Plan from './Plan';

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flex: 1,
    background: theme.palette.background[600],
  },
  header: {
    flex: 0,
    margin: 20,
    color: theme.palette.primary[300],
    fontSize: 20,
    fontWeight: 600,
  },
  planList: {
    flex: 1,
    overflow: 'auto',
    '& > *:first-child': {
      marginTop: 0,
    },
    '& > *': {
      margin: 20,
    }
  },
}));

export interface PlansProps {
  className?: string;
}

export const Plans: FC<PlansProps> = ({
  className,
}) => {
  const classes = useStyles();
  const plans = useTypedSelector(state => state.plans);

  return (
    <div className={cn(classes.root, className)}>
      <h1 className={classes.header}>Plans</h1>
      <ul className={classes.planList}>
        {plans.filter(({ archived }) => !archived).map(plan => (
          <Plan key={`${plan.id}-plan`} plan={plan}/>
        ))}
      </ul>
    </div>
  );
};

export default memo(Plans);
