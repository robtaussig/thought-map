import React, { FC } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import ManagePhotos from './manage-photos';
import { AppState } from '../../../reducers';

interface AppSettingsProps {
  classes: any,
  state: AppState,
}

const styles = (theme: any): StyleRules => ({
  root: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export const AppSettings: FC<AppSettingsProps> = ({ classes, state }) => {

  return (
    <div className={classes.root}>
      <ManagePhotos pictures={state.pictures}/>
    </div>
  );
};

export default withStyles(styles)(AppSettings);
