import React, { useEffect, useState, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CREATE_NEW_PLAN } from '../';
import CircleButton from '../../../General/CircleButton';
import Cancel from '@material-ui/icons/Cancel';

const styles = theme => ({
  root: {
    position: 'absolute',
    ...DEFAULT_STATE,
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.4s ease-out',
    backgroundColor: '#8380ff',
    visibility: 'hidden',
  },
  header: {
    color: 'white',
    fontSize: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 50px',
  },
  circleButton: {
    position: 'fixed',
    border: `2px solid ${theme.palette.gray[200]}`,
    margin: 30,
    height: 70,
    width: 70,
    borderRadius: '50%',
    backgroundColor: theme.palette.gray[600],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s linear',
    color: 'white',
    '&#cancel': {
      left: 0,
      bottom: 0,
    },
    '&:not([disabled])': {
      border: `2px solid ${theme.palette.primary[500]}`,
      '&:hover': {
        transform: 'scale(1.1)',
        ...theme.defaults.castShadow.heavy,
      },
      '&:active': {
        transform: 'scale(1)',
        boxShadow: 'none',
      },
    },
    /**
     * Small
     */
    [theme.breakpoints.down('sm')]: {
      top: 'unset',
      bottom: 0,
      transition: 'all 0.1s linear',
      '&#return-home': {
        left: 'unset',
        right: 0,
        top: 0,
        bottom: 'unset',
        display: 'block',
      },
      '&:not([disabled])': {
        ...theme.defaults.castShadow.heavy,
        '&:hover': {
          transform: 'unset',
        },
        '&.touched': {
          boxShadow: 'none!important',
          transform: 'scale(0.9)!important',
        },
      },
    },
  },
});

export const CreatePlanComponent = ({ classes, open, onClose }) => {
  const [style, setStyle] = useState({});
  const rootRef = useRef(null);

  useEffect(() => {
    const { x, y, height } = rootRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const distanceToBottom = windowHeight - y - height;

    if (open) {
      setStyle({
        top: -y,
        left: -x,
        right: -x,
        bottom: -distanceToBottom,
        borderRadius: 0,
        justifyContent: 'flex-start',
        visibility: 'visible',
      });
    } else {
      setStyle(DEFAULT_STATE);
    }
  }, [open]);

  return (
    <div ref={rootRef} className={classes.root} style={style}>
      <h2 className={classes.header}>{CREATE_NEW_PLAN}</h2>
      <CircleButton
        classes={classes}
        id={'cancel'}
        onClick={onClose}
        label={'Cancel'}
        Icon={Cancel}
      />
    </div>
  );
};

const DEFAULT_STATE = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '10px',
  justifyContent: 'center',
};

export default withStyles(styles)(CreatePlanComponent);