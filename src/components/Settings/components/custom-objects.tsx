import React, { FC, useState, Fragment, useCallback, useRef, useMemo } from 'react';
import { SettingState } from '../../../types';
import { withStyles, StyleRules } from '@material-ui/styles';
import Close from '@material-ui/icons/Close';
import CircleButton from '../../../components/General/CircleButton';
import classNames from 'classnames';
import { useLoadedDB } from '../../../hooks/useDB';
import { useModal } from '../../../hooks/useModal';
import CustomStatuses from './custom-statuses';
import CustomTypes from './custom-types';
import CustomTags from './custom-tags';
import DeleteTemplates from './delete-templates';

interface CustomObjectsProps {
  classes: any;
  settings: SettingState;
}

enum Side {
  TOP = 'left',
  MIDDLE = 'middle',
}

const styles = (theme: any): StyleRules => ({
  container: () => ({
    position: 'fixed',
    height: '100%',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: theme.useDarkMode ? '#2f2f2f' : theme.palette.background[500],
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
    boxShadow: `0px 0px 5px 0px black`,
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    fontSize: 24,
  }),
  button: () => ({
    border: `2px solid ${theme.palette.background[0]}`,
    padding: '3px 0',
    marginTop: 40,
    width: '70%',
    borderRadius: '3px',
    backgroundColor: theme.palette.background[500],
    color: theme.palette.background[0],
    '&:active': {
      backgroundColor: theme.palette.background[700],
      boxShadow: 'none!important',
    },
    '&:disabled': {
      backgroundColor: theme.palette.background[300],
      color: theme.palette.background[0],
    },
    '&:not(:disabled)': {
      boxShadow: `0px 0px 5px 2px black`,
    },
  }),
  circleButton: () => ({
    ...theme.defaults.circleButton,
    backgroundColor: theme.useDarkMode ? 'black' : theme.palette.background[600],
    '&#submit': {
      right: 10,
      bottom: 10,
    },
  }),
});

export const CustomObjects: FC<CustomObjectsProps> = ({ classes, settings }) => {
  const [side, setSide] = useState<Side>(Side.TOP);
  const [openModal, closeModal] = useModal();
  const rootRef = useRef(null);
  const db = useLoadedDB();
  const handleClickClose = useCallback(() => {
    setSide(Side.TOP);
  }, []);

  const handleClickCustomStatuses = useCallback(() => {
    openModal(<CustomStatuses onClose={closeModal} />);
  }, []);

  const handleClickCustomTags = useCallback(() => {
    openModal(<CustomTags onClose={closeModal} />);
  }, []);

  const handleClickCustomTypes = useCallback(() => {
    openModal(<CustomTypes onClose={closeModal} />);
  }, []);

  const handleClickDeleteTemplates = useCallback(() => {
    openModal(<DeleteTemplates onClose={closeModal} />);
  }, []);

  return (
    <Fragment>
      <button className={classes.button} onClick={() => setSide(Side.MIDDLE)}>
        Custom Objects
      </button>
      <div ref={rootRef} className={classNames(classes.container, {
        visible: side === Side.MIDDLE,
        hidden: side === Side.TOP
      })} style={{
        top: side === Side.TOP ? '100%' : 0,
      }}>
        <h1 className={classes.header}>Custom Objects</h1>
        <button className={classes.button} onClick={handleClickCustomStatuses}>Statuses</button>
        <button className={classes.button} onClick={handleClickCustomTags}>Tags</button>
        <button className={classes.button} onClick={handleClickCustomTypes}>Types</button>
        <button className={classes.button} onClick={handleClickDeleteTemplates}>Delete Templates</button>
        <CircleButton classes={classes} id={'submit'} onClick={handleClickClose} label={'Submit'} Icon={Close} />
      </div>
    </Fragment>
  );
};

export default withStyles(styles)(CustomObjects);
