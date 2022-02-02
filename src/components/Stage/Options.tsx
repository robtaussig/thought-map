import React, { FC, memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import cn from 'classnames';
import { Thought } from '../../store/rxdb/schemas/thought';

const useStyles = makeStyles((_theme: any) => ({
  root: {},
}));

export interface OptionsProps {
  className?: string;
  thought: Thought;
  onRequestClose: () => void;
}

export const Options: FC<OptionsProps> = ({
  className,
  thought,
  onRequestClose,
}) => {
  const classes = useStyles();
  console.log(thought, onRequestClose);
  return (
    <div className={cn(classes.root, className)}>
      
    </div>
  );
};

export default memo(Options);
