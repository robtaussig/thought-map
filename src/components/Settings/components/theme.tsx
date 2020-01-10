import React, { FC, useState, Fragment, useCallback, useRef, useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import Close from '@material-ui/icons/Close';
import CircleButton from '../../../components/General/CircleButton';
import classNames from 'classnames';
import { useLoadedDB } from '../../../hooks/useDB';
import CustomizeTheme from './customize-theme';
import { customThemeSelector, CustomTheme, resetDefault } from '../../../reducers/customTheme';

interface ThemeProps {

}

enum Side {
  TOP = 'left',
  MIDDLE = 'middle',
}

const useStyles = makeStyles<CustomTheme>((theme: any) => ({
  container: () => ({
    position: 'fixed',
    height: '100%',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: theme.palette.background[500],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.2s ease-out',
    zIndex: 100,
    '&.hidden': {
      '& #submit': {
        display: 'none',
      }
    }
  }),
  header: () => ({
    flex: '0 0 80px',
    backgroundColor: theme.palette.primary[500],
    boxShadow: '0px 0px 5px 0px black',
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    fontSize: 24,
  }),
  button: () => ({
    border: '2px solid white',
    padding: '3px 0',
    marginTop: 40,
    width: '70%',
    borderRadius: '3px',
    backgroundColor: theme.palette.background[500],
    color: 'white',
    '&:active': {
      backgroundColor: theme.palette.background[700],
      boxShadow: 'none!important',
    },
    '&:disabled': {
      backgroundColor: theme.palette.background[300],
      color: 'white',
    },
    '&:not(:disabled)': {
      boxShadow: '0px 0px 5px 2px black',
    }
  }),
  circleButton: () => ({
    ...theme.defaults.circleButton,
    '&#submit': {
      right: 10,
      bottom: 10,
    },
  }),
  resetButton: () => ({
    margin: '50px auto',
    border: '1px solid white',
    borderRadius: 5,
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: theme.palette.red[500],
    color: 'white',
  }),
}));

export const Theme: FC<ThemeProps> = ({ }) => {
  const customTheme = useSelector(customThemeSelector);
  const classes = useStyles(customTheme);
  const dispatch = useDispatch();
  const [side, setSide] = useState<Side>(Side.TOP);
  const rootRef = useRef(null);
  const db = useLoadedDB();
  const handleClickClose = useCallback(() => {
    setSide(Side.TOP);
  }, []);

  const handleReset = () => dispatch(resetDefault());

  return (
    <Fragment>
      <button className={classes.button} onClick={() => setSide(Side.MIDDLE)}>
        Theme
      </button>
      <div ref={rootRef} className={classNames(classes.container, {
        visible: side === Side.MIDDLE,
        hidden: side === Side.TOP
      })} style={{
        top: side === Side.TOP ? '100%' : 0,
      }}>
        <h1 className={classes.header}>Theme</h1>
        <CustomizeTheme />
        <button className={classes.resetButton} onClick={handleReset}>Reset</button>
        <CircleButton classes={classes} id={'submit'} onClick={handleClickClose} label={'Submit'} Icon={Close} />
      </div>
    </Fragment>
  );
};

export default Theme;
