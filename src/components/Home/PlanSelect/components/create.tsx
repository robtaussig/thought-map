import React, { FC } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';

interface CreatePlanProps {
  classes: any;
  onClose: () => void;
}

const styles = (theme: any): StyleRules => ({
  root: {

  },
});

export const CreatePlan: FC<CreatePlanProps> = ({ classes }) => {

  return (
    <div className={classes.root}>

    </div>
  );
};

export default withStyles(styles)(CreatePlan);
