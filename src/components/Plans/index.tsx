import React, { FC, memo, useState } from 'react';
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
    display: 'flex',
    alignItems: 'center',
    flex: 0,
    margin: 20,
    color: theme.palette.primary[300],
  },
  headerText: {
    fontSize: 20,
    fontWeight: 600,
  },
  showArchived: {
    marginLeft: 'auto',
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
  const [showArchived, setShowArchived] = useState(false);

  return (
    <div className={cn(classes.root, className)}>
      <header className={classes.header}>
        <h1 className={classes.headerText}>Plans</h1>
        <label className={classes.showArchived}>
          <input type={'checkbox'} checked={showArchived} onChange={e => setShowArchived(e.target.checked)}/>
          Show Archived
        </label>
      </header>
      <ul className={classes.planList}>
        {plans.filter(({ archived }) => showArchived || !archived).map(plan => (
          <Plan key={`${plan.id}-plan`} plan={plan}/>
        ))}
      </ul>
    </div>
  );
};

export default memo(Plans);
