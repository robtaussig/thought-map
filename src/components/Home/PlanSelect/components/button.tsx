
import React, { FC, useEffect, useState, useMemo, useRef } from 'react';
import Build from '@material-ui/icons/Build';
import CircleButton from '../../../General/CircleButton';
import { useDispatch, useSelector } from 'react-redux';
import { displayThoughtSettingsSelector, toggle } from '../../../../reducers/displayThoughtSettings';
import useModal from '../../../../hooks/useModal';
import PlanSelectActions from './actions';
import { withStyles, StyleRules } from '@material-ui/styles';
import useApp from '../../../../hooks/useApp';
import { getIdFromUrl } from '../../../../lib/util';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Settings from '@material-ui/icons/Settings';

interface PlanButtonProps {
  classes: any;
}

const styles = (theme: any): StyleRules => ({
  circleButton: {
    ...theme.defaults.circleButton,
    border: `2px solid ${theme.palette.primary[500]}`,
    backgroundColor: theme.palette.gray[600],
    bottom: 10,
    left: 10,
    zIndex: 999,
    '&#has-secondary': {
      border: `2px solid ${theme.palette.secondary[500]}`,
    },
    '&#settings': {
      '& svg': {
        willChange: 'transform',
        transition: 'transform 0.3s linear',
        transform: 'rotate(-90deg)',
        '&.gear-opening': {
          transform: 'rotate(90deg) scale(2)',
        },
      },
    },
  },
});

export const PlanButton: FC<PlanButtonProps> = ({ classes }) => {
  const [openModal, closeModal] = useModal();
  const settingsGearButtonSVGRef = useRef<HTMLElement>(null);
  const dispatch = useDispatch();
  const displayThoughtSettings = useSelector(displayThoughtSettingsSelector);
  const [hideButton, setHideButton] = useState<boolean>(false);
  const { history } = useApp();

  useEffect(() => {
    setHideButton(/(stage|history|connections)$/.test(history.location.pathname));
  }, [history.location.pathname])  

  const [Icon, label, handleClick, handleLongPress, isSettings]: [any, string, () => void, () => void, boolean?] = useMemo(() => {
    const handleClickEditPlan = () => {
      const planId = getIdFromUrl(history, 'plan');
      history.push(planId ? `/plan/${planId}/settings?type=plan` : `/settings`);
    };

    const handleLongPress = () => {
      const planId = getIdFromUrl(history, 'plan');
      openModal(
        <PlanSelectActions
          planId={planId}
          onClose={closeModal}
        />
      );
    };

    const handleGoBack = () => {
      history.goBack();
    };

    const handleClickSettings = () => {
      dispatch(toggle());
    };

    if (/settings/.test(history.location.pathname)) {
      return [ArrowBack, 'Return Home', handleGoBack, null];
    } else if (/thought/.test(history.location.pathname)) {
      return [Settings, 'Settings', handleClickSettings, null, true];
    } else {
      return [Build, 'Edit Plan', handleClickEditPlan, handleLongPress];
    }
  }, [history.location.pathname]);

  useEffect(() => {
    if (displayThoughtSettings) {
      gearOpening(settingsGearButtonSVGRef.current);
    } else {
      gearClosing(settingsGearButtonSVGRef.current);
    }
  }, [displayThoughtSettings]);

  if (hideButton) return null;

  return (
    <CircleButton
      svgRef={settingsGearButtonSVGRef}
      id={isSettings ? 'settings' : handleLongPress ? 'has-secondary' : 'edit-plan'}
      classes={classes}
      onClick={handleClick}
      label={label}
      Icon={Icon}
      onLongPress={handleLongPress}
    />
  );
};

const gearOpening = (element: HTMLElement): void => {
  element && element.classList.add('gear-opening');
};

const gearClosing = (element: HTMLElement): void => {
  element && element.classList.remove('gear-opening');
}

export default withStyles(styles)(PlanButton);
