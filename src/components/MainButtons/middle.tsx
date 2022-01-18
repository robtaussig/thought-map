import React, { FC, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { withStyles, StyleRules } from '@material-ui/styles';
import { stageSelector } from '../../reducers/stage';
import { thoughtSelector } from '../../reducers/thoughts';
import { toggle } from '../../reducers/displayPriorities';
import { useDispatch } from 'react-redux';
import { thoughts as thoughtActions } from '../../actions';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoadedDB } from '../../hooks/useDB';
import CircleButton from '../General/CircleButton';
import Bookmark from '@material-ui/icons/Bookmark';
import ArrowBack from '@material-ui/icons/ArrowBack';
import PriorityHigh from '@material-ui/icons/PriorityHigh';
import Queue from '@material-ui/icons/Queue';
import { useIdFromUrl } from '../../lib/util';
import { emphasizeButton, tutorialSelector, ButtonPositions } from '../../reducers/tutorial';
import { format } from 'date-fns';

interface MiddleButtonProps {
  classes: any;
}

const styles = (theme: any): StyleRules => ({
  circleButton: () => ({
    ...theme.defaults.circleButton,
    border: `2px solid ${theme.palette.primary[500]}`,
    backgroundColor: 'black',
    bottom: 0,
    right: 'calc(50% - 50px)',
    zIndex: 999,
    '&#backlog-button': {
      color: theme.palette.negative[300],
      border: `2px solid ${theme.palette.negative[300]}`,
    },
    '&#empty-stage': {
      opacity: 0.5,
      border: `2px solid ${theme.palette.negative[300]}`,
    },
    '&#stage-button': {
      border: `2px solid ${theme.palette.secondary[500]}`,
    },
  }),
});

const STAGING_PATH_NAME = '/stage';

enum CurrentPage {
  Home,
  Thought,
  Connections,
  History,
  Settings,
  Backups,
  Merge,
  Timeline,
  Privacy,
}

export const MiddleButton: FC<MiddleButtonProps> = ({ classes }) => {
  const stage = useSelector(stageSelector);
  const thoughts = useSelector(thoughtSelector);
  const tutorial = useSelector(tutorialSelector);
  const dispatch = useDispatch();
  const { db } = useLoadedDB();
  const [canStage, setCanStage] = useState<boolean>(false);
  const [hideButton, setHideButton] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const thoughtId = useIdFromUrl('thought');
  const isStaging = location.pathname === STAGING_PATH_NAME;
  const currentPage = useMemo(() => {
    if (/history$/.test(location.pathname)) return CurrentPage.History;
    if (/connections$/.test(location.pathname)) return CurrentPage.Connections;
    if (/settings/.test(location.pathname)) return CurrentPage.Settings;
    if (/thought/.test(location.pathname)) return CurrentPage.Thought;
    if (/backups/.test(location.pathname)) return CurrentPage.Backups;
    if (/merge/.test(location.pathname)) return CurrentPage.Merge;
    if (/timeline/.test(location.pathname)) return CurrentPage.Timeline;
    if (/privacy/.test(location.pathname)) return CurrentPage.Privacy;
    return CurrentPage.Home;
  }, [location.pathname]);

  const handleClick = async () => {
    if (isStaging) {
      navigate(-1);
    } else {
      navigate(`${STAGING_PATH_NAME}`);
    }
  };

  useEffect(() => {
    setCanStage(
      currentPage === CurrentPage.Thought &&
      stage.current.includes(String(thoughtId)) === false
    );
  }, [stage, currentPage, thoughtId]);

  useEffect(() => {
    setHideButton([
      CurrentPage.History,
      CurrentPage.Connections,
      CurrentPage.Settings,
      CurrentPage.Backups,
      CurrentPage.Merge,
      CurrentPage.Timeline,
      CurrentPage.Privacy,
    ].includes(currentPage));
  }, [currentPage]);

  const handleLongPress = async () => {
    if (currentPage !== CurrentPage.Thought) {
      dispatch(toggle());
    } else if (canStage) {
      let thoughtQuery = '';
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
      navigate(`${STAGING_PATH_NAME}${thoughtQuery}`);
    }
  };

  if (hideButton) return null;
  const isEmphasized = tutorial.emphasizeButton === ButtonPositions.Middle;
  const isAltEmphasized = tutorial.emphasizeButton === ButtonPositions.MiddleAlt;

  if (isStaging) {
    return (
      <CircleButton
        onClick={() => {
          if (!isAltEmphasized) {
            isEmphasized && dispatch(emphasizeButton(null));
            handleClick();
          }
        }}
        id={'return-home'}
        classes={classes}
        label={'Back'}
        Icon={ArrowBack}
        emphasize={isEmphasized}
      />
    );
  } else {
    return (
      <CircleButton
        onClick={handleClick ? () => {
          if (!isAltEmphasized) {
            isEmphasized && dispatch(emphasizeButton(null));
            handleClick();
          }
        } : undefined}
        id={canStage ? 'stage-button' : stage.backlog.length > 0 ? 'backlog-button' : stage.current.length === 0 ? 'empty-stage' : 'staging-button'}
        classes={classes}
        label={'Staging'}
        Icon={Bookmark}
        onLongPress={handleLongPress ? () => {
          if (!isEmphasized) {
            isAltEmphasized && dispatch(emphasizeButton(null));
            if (canStage || currentPage === CurrentPage.Home) {
              handleLongPress();
            }
          }
        } : undefined}
        LongPressIcon={
          canStage ? Queue :
            currentPage === CurrentPage.Home ? PriorityHigh : null}
        emphasize={isEmphasized || isAltEmphasized}
      />
    );
  }
};

export default withStyles(styles)(MiddleButton);
