import React, { FC } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import Help from '@material-ui/icons/Help';
import { useModal } from '../../hooks/useModal';

interface TooltipProps {
  classes: any,
  text: string,
}

const styles = (theme: any): StyleRules => ({
  root: {
    marginLeft: 3,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  icon: {
    fontSize: 12,
    color: 'white',
  },
});

export const Tooltip: FC<TooltipProps> = ({ classes, text }) => {
  const [openModal, closeModal] = useModal();

  const handleClickTooltip = () => {
    openModal(<span>{text}</span>, 'Tooltip');
  };

  return (
    <button className={classes.root} onClick={handleClickTooltip}>
      <Help className={classes.icon}/>
    </button>
  );
};

export default withStyles(styles)(Tooltip);
