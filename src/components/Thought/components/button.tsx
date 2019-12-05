import React, { FC, useEffect, useState, useMemo } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import useApp from '../../../hooks/useApp';
import useModal from '../../../hooks/useModal';
import CreateThought from '../../CreateThought';
import CircleButton from '../../General/CircleButton';
import History from '@material-ui/icons/History';
import Add from '@material-ui/icons/Add';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { getIdFromUrl, homeUrl } from '../../../lib/util';

interface ThoughtButtonProps {
  classes: any;
  typeOptions: string[];
}

const styles = (theme: any): StyleRules => ({
  circleButton: {
    ...theme.defaults.circleButton,
    border: `2px solid ${theme.palette.primary[500]}`,
    backgroundColor: theme.palette.gray[600],
    bottom: 10,
    right: 10,
    zIndex: 999,
    '&#has-secondary': {
      border: `2px solid ${theme.palette.secondary[500]}`,
    },
  },
});

export const ThoughtButton: FC<ThoughtButtonProps> = ({ classes, typeOptions }) => {
  const [openModal, closeModal] = useModal();
  const [hideButton, setHideButton] = useState<boolean>(false);
  const { history } = useApp();

  useEffect(() => {
    setHideButton(/(stage|settings)$/.test(history.location.pathname));
  }, [history.location.pathname])  

  const [Icon, label, handleClick, handleLongPress]: [any, string, () => void, () => void] = useMemo(() => {

    const handleAddThought = () => {
      openModal(
        <CreateThought
          onClose={closeModal}
          typeOptions={typeOptions}
        />, 'Create Thought'
      );
    }

    const handleClickViewConnections = () => {
      const thoughtId = getIdFromUrl(history, 'thought');
      history.push(`${homeUrl(history)}thought/${thoughtId}/connections`);
    };

    const handleClickViewHistory = () => {
      const thoughtId = getIdFromUrl(history, 'thought');
      history.push(`${homeUrl(history)}thought/${thoughtId}/history`);
    };

    const handleBack = () => {
      history.goBack();
    };

    if (/(history|connections)$/.test(history.location.pathname)) {
      return [ArrowBack, 'Back', handleBack, null];
    } else if (/thought/.test(history.location.pathname)) {
      return [History, 'History', handleClickViewConnections, handleClickViewHistory];
    } else {
      return [Add, 'Create Thought', handleAddThought, null];
    }
  }, [history.location.pathname]);

  if (hideButton) return null;

  return (
    <CircleButton
      onClick={handleClick}
      id={handleLongPress ? 'has-secondary' : 'thought-button'}
      classes={classes}
      label={label}
      Icon={Icon}
      onLongPress={handleLongPress}
    />
  );
};

export default withStyles(styles)(ThoughtButton);
