import React, { FC, ReactNode, memo, useEffect, useMemo } from 'react';
import { StyleRules } from '@material-ui/styles';
import cn from 'classnames';
import Home from '@material-ui/icons/Home';
import CircleButton from '../../components/General/CircleButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { openConfirmation, useHomeUrl, useIdFromUrl, useSearchParam } from '../../lib/util';
import { makeStyles } from '@material-ui/core';
import { Add, ArrowBack, Bookmark, Build, Delete, Link, PlaylistAddCheck, PriorityHigh, Settings } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { displayThoughtSettingsSelector, toggle as toggleThoughtSettings } from '../../reducers/displayThoughtSettings';
import classNames from 'classnames';
import useModal from '../../hooks/useModal';
import PlanSelectActions from '../../components/Home/PlanSelect/components/actions';
import { ButtonPositions, tutorialSelector } from '../../reducers/tutorial';
import { toggle as togglePriorities } from '../../reducers/displayPriorities';
import { thoughts as thoughtActions } from '../../actions';
import { useLoadedDB } from '../../hooks/useDB';
import History from '@material-ui/icons/History';
import Check from '@material-ui/icons/Check';
import { useBackupIdFromHistory } from '../../components/Merge/util';
import { mergeResultsSelector } from '../../reducers/mergeResults';
import DemandBackupButton from './DemandBackupButton';
import { settingSelector } from '../../reducers/settings';
import CreateThought from '../../components/CreateThought';
import CreateBulkThought from '../../components/CreateThought/Bulk';
import { typeOptionsSelector } from '../../reducers/typeOptions';
import CreatePlan from '../../components/Home/PlanSelect/components/create';

const useStyles = makeStyles((theme: any): StyleRules => ({
  root: {
    backgroundColor: theme.useDarkMode ? '#2f2f2f' : theme.palette.background[800],
    color: theme.palette.background[200],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleButton: () => ({
    ...theme.defaults.circleButton,
    position: 'relative',
    margin: '0 10px',
    height: 50,
    width: 50,
    backgroundColor: theme.palette.primary[500],
    '&#settings-open': {
      '& svg': {
        willChange: 'transform',
        transition: 'transform 0.3s linear',
        transform: 'rotate(90deg) scale(2)',
      },
    },
    '&#settings-closed': {
      '& svg': {
        willChange: 'transform',
        transition: 'transform 0.3s linear',
        transform: 'rotate(-90deg)',
      },
    },
    '&#delete-button': {
      border: `2px solid ${theme.palette.negative[300]}`,
      backgroundColor: theme.palette.negative[300],
    },
    '&#updating-button': {
      animation: 'rotate 1s infinite',
      border: '2px solid gray',
      backgroundColor: 'gray',
    },
    '&#updated': {
      border: '2px solid limegreen',
      backgroundColor: 'limegreen',
    },
    '&#merge': {
      '&:disabled': {
        border: '2px solid #ccc',
        backgroundColor: '#ccc',
      },
    },
  }),
}));

export interface AppNavProps {
  className?: string;
}

const isThoughtRegex = /thought/;
const isHistoryRegex = /history$/;
const isConnectionsRegex = /connections$/;
const isSettingsRegex = /settings/;
const isBackupsRegex = /backups/;
const isMergeRegex = /merge/;
const isTimelineRegex = /timeline/;
const isPrivacyRegex = /privacy/;
const isStageRegex = /stage/;
const isPlansRegex = /plans/;



enum Page {
  Home,
  Thought,
  Connections,
  History,
  Settings,
  Backups,
  Merge,
  Timeline,
  Privacy,
  Stage,
  Plans,
}

export const AppNav: FC<AppNavProps> = ({
  className,
}) => {
  const classes = useStyles();
  const buttons: ReactNode[]  = [];
  const navigate = useNavigate();
  const location = useLocation();
  const planId = useIdFromUrl('plan');
  const thoughtId = useIdFromUrl('thought');
  const { db } = useLoadedDB();
  const dispatch = useDispatch();
  const displayThoughtSettings = useSelector(displayThoughtSettingsSelector);
  const [openModal, closeModal] = useModal();
  const tutorial = useSelector(tutorialSelector);
  const homeUrl = useHomeUrl();
  const version = useSearchParam('v');
  const backupId = useBackupIdFromHistory();
  const { comparables } = useSelector(mergeResultsSelector);
  const settings = useSelector(settingSelector);
  const typeOptions = useSelector(typeOptionsSelector);

  useEffect(() => {
    dispatch(toggleThoughtSettings(false));
  }, [dispatch, location.pathname]);
  
  const currentPage = useMemo(() => {
    if (isHistoryRegex.test(location.pathname)) return Page.History;
    if (isConnectionsRegex.test(location.pathname)) return Page.Connections;
    if (isSettingsRegex.test(location.pathname)) return Page.Settings;
    if (isThoughtRegex.test(location.pathname)) return Page.Thought;
    if (isBackupsRegex.test(location.pathname)) return Page.Backups;
    if (isMergeRegex.test(location.pathname)) return Page.Merge;
    if (isTimelineRegex.test(location.pathname)) return Page.Timeline;
    if (isPrivacyRegex.test(location.pathname)) return Page.Privacy;
    if (isStageRegex.test(location.pathname)) return Page.Stage;
    if (isPlansRegex.test(location.pathname)) return Page.Plans;
    return Page.Home;
  }, [location.pathname]);

  const returnHomeButton = (
    <CircleButton
      key={'return-home'}
      classes={classes}
      onClick={() => {
        navigate(planId ? `/plan/${planId}` : '/');
      }}
      label={'Return Home'}
      Icon={Home}
      emphasize={tutorial.emphasizeButton === ButtonPositions.Left}
    />
  );

  const editPlanButton = (
    <CircleButton
      key={'plan-settings'}
      classes={classes}
      onClick={() => {
        navigate(planId ? `/plan/${planId}/settings?type=plan` : '/settings');
      }}
      label={'Edit Plan'}
      Icon={Build}
      emphasize={tutorial.emphasizeButton === ButtonPositions.Left}
    />
  );

  const reviewPlanButton = (
    <CircleButton
      key={'review'}
      classes={classes}
      onClick={() => {
        openModal(
          <PlanSelectActions
            planId={planId}
            onClose={closeModal}
          />
        );
      }}
      label={'Review Plan'}
      Icon={PlaylistAddCheck}
      emphasize={tutorial.emphasizeButton === ButtonPositions.LeftAlt}
    />
  );

  const stageButton = (
    <CircleButton
      key={'stage'}
      onClick={() => {
        navigate('/stage');
      }}
      classes={classes}
      label={'Staging'}
      Icon={Bookmark}
      emphasize={tutorial.emphasizeButton === ButtonPositions.Middle}
    />
  );

  const thoughtSettingsButton = (
    <CircleButton
      key={'settings'}
      id={classNames({
        'settings-open': displayThoughtSettings,
        'settings-closed': !displayThoughtSettings,
      })}
      classes={classes}
      onClick={() => {
        dispatch(toggleThoughtSettings());
      }}
      label={'Settings'}
      Icon={Settings}
      emphasize={tutorial.emphasizeButton === ButtonPositions.Left}
    />
  );

  const prioritiesButton = (
    <CircleButton
      key={'priorities'}
      onClick={() => {
        dispatch(togglePriorities());
      }}
      classes={classes}
      label={'Priorities'}
      Icon={PriorityHigh}
    />
  );
  
  const deleteThoughtButton = (
    <CircleButton
      key={'delete-thought'}
      id={'delete-button'}
      onClick={async () => {
        const onConfirm = async () => {
          if (typeof thoughtId === 'string') {
            await thoughtActions.deleteThought(db, thoughtId);
          }
          navigate(homeUrl);
        };

        openConfirmation('Are you sure you want to delete this?', onConfirm);
      }}
      classes={classes}
      label={'Delete Thought'}
      Icon={Delete}
    />
  );

  const connectionsButton = (
    <CircleButton
      key={'connections'}
      onClick={() => {
        navigate(`${homeUrl}thought/${thoughtId}/connections`);
      }}
      classes={classes}
      label={'Connections'}
      Icon={Link}
    />
  );

  const historyButton = (
    <CircleButton
      key={'history'}
      onClick={() => {
        navigate(`${homeUrl}thought/${thoughtId}/history`);
      }}
      classes={classes}
      label={'History'}
      Icon={History}
    />
  );

  const mergeButton = (
    <CircleButton
      key={'merge'}
      onClick={() => {
        navigate(`/process-merge/${backupId}?v=${version}`);
      }}
      classes={classes}
      disabled={comparables.length > 0}
      label={'Merge'}
      Icon={Check}
    />
  );

  const uploadDataButton = (
    <DemandBackupButton key={'upload-button'} classes={classes}/>
  );

  const createThoughtButton = (
    <CircleButton
      key={'create-thought'}
      onClick={() => {
        openModal(
          <CreateThought
            onClose={closeModal}
            onCreateBulk={() => {
              closeModal();
              openModal(
                <CreateBulkThought
                  onClose={closeModal}
                />, 'Create Bulk Thoughts'
              );
            }}
            typeOptions={typeOptions}
          />, 'Create Thought'
        );
      }}
      classes={classes}
      label={'Create Thought'}
      Icon={Add}
      emphasize={tutorial.emphasizeButton === ButtonPositions.Right}
    />
  );

  const createThoughtAndStageButton = (
    <CircleButton
      key={'create-thought'}
      onClick={() => {
        openModal(
          <CreateThought
            onClose={closeModal}
            andStage
            onCreateBulk={() => {
              closeModal();
              openModal(
                <CreateBulkThought
                  onClose={closeModal}
                />, 'Create Bulk Thoughts'
              );
            }}
            typeOptions={typeOptions}
          />, 'Create Thought'
        );
      }}
      classes={classes}
      label={'Create Thought'}
      Icon={Add}
      emphasize={tutorial.emphasizeButton === ButtonPositions.Right}
    />
  );

  const backToThoughtButton = (
    <CircleButton
      key={'back-to-thought'}
      onClick={() => {
        navigate(`/thought/${thoughtId}`);
      }}
      classes={classes}
      label={'Back to Thought'}
      Icon={ArrowBack}
    />
  );

  const backButton = (
    <CircleButton
      key={'back-button'}
      onClick={() => {
        navigate(-1);
      }}
      classes={classes}
      label={'Back'}
      Icon={ArrowBack}
    />
  );

  const createPlanButton = (
    <CircleButton
      key={'create-plan-button'}
      onClick={() => {
        openModal(<CreatePlan
          onClose={closeModal}
        />);
      }}
      classes={classes}
      label={'Create Plan'}
      Icon={Add}
    />
  );

  switch (currentPage) {
    case Page.Home:
      buttons.push(editPlanButton);
      buttons.push(reviewPlanButton);
      buttons.push(stageButton);
      buttons.push(prioritiesButton);
      buttons.push(createThoughtButton);
      break;
    case Page.History:
      buttons.push(returnHomeButton);
      buttons.push(backToThoughtButton);
      buttons.push(createThoughtButton);
      break;
    case Page.Connections:
      buttons.push(returnHomeButton);
      buttons.push(backToThoughtButton);
      buttons.push(createThoughtButton);
      break;
    case Page.Settings:
      buttons.push(returnHomeButton);
      if (settings.enableBackupOnDemand) {
        buttons.push(uploadDataButton);
      }
      buttons.push(createThoughtButton);
      break;
    case Page.Thought:
      buttons.push(returnHomeButton);
      if (!displayThoughtSettings) {
        buttons.push(stageButton);
      }
      buttons.push(thoughtSettingsButton);
      if (displayThoughtSettings) {
        buttons.push(deleteThoughtButton);
      } else {
        buttons.push(connectionsButton);
        buttons.push(historyButton);
      }
      break;
    case Page.Backups:
      buttons.push(backButton);
      buttons.push(createThoughtButton);
      break;
    case Page.Merge:
      buttons.push(backButton);
      buttons.push(mergeButton);
      break;
    case Page.Timeline:
      buttons.push(backButton);
      buttons.push(createThoughtButton);
      break;
    case Page.Privacy:
      buttons.push(returnHomeButton);
      break;
    case Page.Stage:
      buttons.push(backButton);
      buttons.push(createThoughtAndStageButton);
      break;
    case Page.Plans:
      buttons.push(backButton);
      buttons.push(createPlanButton);
      break;
  }

  return (
    <nav className={cn(classes.root, className)}>
      {buttons}
    </nav>
  );
};

export default memo(AppNav);
