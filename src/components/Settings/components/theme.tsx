import React, { FC, useState, Fragment, useCallback, useRef, useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import Close from '@material-ui/icons/Close';
import CircleButton from '../../../components/General/CircleButton';
import classNames from 'classnames';
import { useLoadedDB } from '../../../hooks/useDB';
import CustomizeTheme from './customize-theme';
import { customThemeSelector, CustomTheme } from '../../../reducers/customTheme';

interface ThemeProps {

}

enum Side {
  TOP = 'left',
  MIDDLE = 'middle',
}

const useStyles = makeStyles<CustomTheme>((theme: any) => ({
  container: {
    position: 'fixed',
    height: '100%',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#545454',
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
  },
  header: (props: CustomTheme) => ({
    flex: '0 0 80px',
    backgroundColor: props.palette.primary[500],
    boxShadow: '0px 0px 5px 0px black',
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    fontSize: 24,
  }),
  button: (props: CustomTheme) => ({
    border: '2px solid white',
    padding: '3px 0',
    marginTop: 40,
    width: '70%',
    borderRadius: '3px',
    backgroundColor: props.palette.gray[500],
    color: 'white',
    '&:active': {
      backgroundColor: props.palette.gray[700],
      boxShadow: 'none!important',
    },
    '&:disabled': {
      backgroundColor: props.palette.gray[300],
      color: 'white',
    },
    '&:not(:disabled)': {
      boxShadow: '0px 0px 5px 2px black',
    }
  }),
  circleButton: (props: CustomTheme) => ({
    ...theme.defaults.circleButton,
    ...props.defaults.circleButton,
    '&#submit': {
      right: 10,
      bottom: 10,
    },
  }),
}));

export const Theme: FC<ThemeProps> = ({ }) => {
  const customTheme = useSelector(customThemeSelector);
  const classes = useStyles(customTheme);
  const [side, setSide] = useState<Side>(Side.TOP);
  const rootRef = useRef(null);
  const db = useLoadedDB();
  const handleClickClose = useCallback(() => {
    setSide(Side.TOP);
  }, []);

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
        <CircleButton classes={classes} id={'submit'} onClick={handleClickClose} label={'Submit'} Icon={Close} />
      </div>
    </Fragment>
  );
};

export default Theme;
