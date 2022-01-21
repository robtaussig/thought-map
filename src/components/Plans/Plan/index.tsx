import React, { FC, memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import cn from 'classnames';
import { Plan as PlanType } from '../../../store/rxdb/schemas/plan';
import ArrowRight from '@material-ui/icons/ArrowRight';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.background[200],
    padding: 20,
    borderRadius: '10px'
  },
  header: {
    fontSize: 16,
    fontWeight: 600,
  },
  link: {
    marginLeft: 'auto',
  },
}));

export interface PlanProps {
  className?: string;
  plan: PlanType
}

export const Plan: FC<PlanProps> = ({
  className,
  plan,
}) => {
  const classes = useStyles();

  return (
    <div className={cn(classes.root, className)}>
      <h2 className={classes.header}>{plan.name}</h2>
      <Link className={classes.link} to={`/plan/${plan.id}/`}>
        <ArrowRight/>
      </Link>
    </div>
  );
};

export default memo(Plan);
