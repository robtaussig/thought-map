import React, { FC, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { withStyles, StyleRules } from '@material-ui/styles';
import { stageSelector } from '../../../reducers/stage';
import { thoughtSelector } from '../../../reducers/thoughts';
import { thoughts as thoughtActions } from '../../../actions';
import useApp from '../../../hooks/useApp';
import { useLoadedDB } from '../../../hooks/useDB';
import CircleButton from '../../General/CircleButton';
import Bookmark from '@material-ui/icons/Bookmark';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { getIdFromUrl } from '../../../lib/util';
import { format } from 'date-fns';

interface StagingButtonProps {
  classes: any;
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
    '&#empty-stage': {
      opacity: 0.5,
      border: `2px solid ${theme.palette.gray[500]}`,
    },
    '&#stage-button': {
      border: `2px solid ${theme.palette.secondary[500]}`,      
    },
  },
});

const STAGING_PATH_NAME = '/stage';

export const StagingButton: FC<StagingButtonProps> = ({ classes }) => {
  const stage = useSelector(stageSelector);
  const thoughts = useSelector(thoughtSelector);
  const db = useLoadedDB();
  const [canStage, setCanStage] = useState<boolean>(false);
  const [hideButton, setHideButton] = useState<boolean>(false);
  const { history } = useApp();
  const isStaging = history.location.pathname === STAGING_PATH_NAME;
  const handleClick = async (_: any, withThought?: boolean) => {
    if (isStaging) {
      history.goBack();
    } else {
      let thoughtQuery = '';
      if (withThought && canStage) {
        const thoughtId = getIdFromUrl(history, 'thought');
        if (typeof thoughtId === 'string') {
          const thought = thoughts.find(({ id }) => id === thoughtId);
          if (thought && thought.status !== 'completed') {
            await thoughtActions.editThought(db, {
              ...thought,
              stagedOn: format(new Date(), 'yyyy-MM-dd'),
            });
            thoughtQuery = `?from=${thoughtId}`;
          }
        }
      }
      history.push(`${STAGING_PATH_NAME}${thoughtQuery}`);
    }
  };

  useEffect(() => {
    setCanStage(
      /thought/.test(history.location.pathname) &&
      stage.current.includes(String(getIdFromUrl(history, 'thought'))) === false
    );
  }, [stage, history.location.pathname]);

  useEffect(() => {
    setHideButton(/(history|connections|settings)$/.test(history.location.pathname));
  }, [history.location.pathname])

  if (hideButton) return null;

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
  } else {
    return (
      <CircleButton
        onClick={handleClick}
        id={canStage ? 'stage-button' : stage.backlog.length > 0 ? 'backlog-button' : stage.current.length === 0 ? 'empty-stage' : 'staging-button'}
        classes={classes}
        label={'Staging'}
        Icon={Bookmark}
        onLongPress={() => handleClick(null, true)}
      />
    );
  }
};

export default withStyles(styles)(StagingButton);
