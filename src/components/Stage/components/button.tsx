import React, { FC, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { withStyles, StyleRules } from '@material-ui/styles';
import { stageSelector } from '../../../reducers/stage';
import useApp from '../../../hooks/useApp';
import CircleButton from '../../General/CircleButton';
import Bookmark from '@material-ui/icons/Bookmark';
import ArrowBack from '@material-ui/icons/ArrowBack';

interface StagingButtonProps {
  classes: any,
}

const styles = (theme: any): StyleRules => ({
  circleButton: {
    ...theme.defaults.circleButton,
    border: `2px solid ${theme.palette.primary[500]}`,
    backgroundColor: theme.palette.gray[600],
    bottom: 10,
    right: 'calc(50% - 55px)',
    zIndex: 999,
    '&#backlog-button': {
      color: theme.palette.red[300],
      border: `2px solid ${theme.palette.red[300]}`,
    },
  },
});

const STAGING_PATH_NAME = '/stage';

export const StagingButton: FC<StagingButtonProps> = ({ classes }) => {
  const stage = useSelector(stageSelector);
  const { history } = useApp();
  const isStaging = history.location.pathname === STAGING_PATH_NAME;
  const handleClick = useCallback(() => {
    if (isStaging) {
      history.goBack();
    } else {
      history.push(STAGING_PATH_NAME);
    }
  }, [isStaging]);

  if (isStaging) {
    return (
      <CircleButton
        onClick={handleClick}
        id={'return-home'}
        classes={classes}
        label={'Back'}
        Icon={ArrowBack}
      />
    );
  } else if (stage.current.length + stage.backlog.length > 0) {
    return (
      <CircleButton
        onClick={handleClick}
        id={stage.backlog.length > 0 ? 'backlog-button' : 'staging-button'}
        classes={classes}
        label={'Staging'}
        Icon={Bookmark}
      />
    );
  }

  return null;
};

export default withStyles(styles)(StagingButton);
