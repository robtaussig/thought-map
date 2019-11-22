import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { withStyles, StyleRules } from '@material-ui/styles';
import { stageSelector } from '../../reducers/stage';

interface StageProps {
  classes: any,
}

const styles = (theme: any): StyleRules => ({
  root: {

  },
});

export const Stage: FC<StageProps> = ({ classes }) => {
  const stage = useSelector(stageSelector);

  console.log(stage);

  return null;
};

export default withStyles(styles)(Stage);
