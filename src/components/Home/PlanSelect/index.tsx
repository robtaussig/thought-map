import React, { FC, memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import cn from 'classnames';
import { Plan } from '../../../store/rxdb/schemas/plan';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.background[200],
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 600,
  },
  plansLink: {
    marginLeft: 'auto',
    borderBottom: `2px solid ${theme.palette.primary[500]}`,
    textTransform: 'uppercase',
    color: 'inherit',
  },
  homeLink: {
    marginLeft: 20,
    borderBottom: `2px solid ${theme.palette.primary[500]}`,
    textTransform: 'uppercase',
    color: 'inherit',
  },
}));

export interface PlanSelectProps {
  className?: string;
  plan: Plan;
}

export const PlanSelect: FC<PlanSelectProps> = ({
  className,
  plan,
}) => {
  const classes = useStyles();

  return (
    <header className={cn(classes.root, className)}>
      <h1 className={classes.header}>{plan?.name ?? 'Thought Map'}</h1>
      <Link className={classes.plansLink} to={'/plans'}>Plans</Link>
      <Link className={classes.homeLink} to={'/'}>Home</Link>
    </header>
  );
};

export default memo(PlanSelect);
