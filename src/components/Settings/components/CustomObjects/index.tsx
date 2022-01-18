import React, { FC, Fragment, useCallback, useRef, useState } from 'react';
import Close from '@material-ui/icons/Close';
import CircleButton from '../../../../components/General/CircleButton';
import classNames from 'classnames';
import { useModal } from '../../../../hooks/useModal';
import CustomStatuses from './components/custom-statuses';
import CustomTypes from './components/custom-types';
import CustomTags from './components/custom-tags';
import DeleteTemplates from './components/delete-templates';
import { useCustomObjectStyles } from './styles';

enum Side {
  TOP = 'left',
  MIDDLE = 'middle',
}

export const CustomObjects: FC = () => {
  const classes = useCustomObjectStyles({});
  const [side, setSide] = useState<Side>(Side.TOP);
  const [openModal, closeModal] = useModal();
  const rootRef = useRef(null);
  const handleClickClose = useCallback(() => {
    setSide(Side.TOP);
  }, []);

  const handleClickCustomStatuses = useCallback(() => {
    openModal(<CustomStatuses />);
  }, []);

  const handleClickCustomTags = useCallback(() => {
    openModal(<CustomTags />);
  }, []);

  const handleClickCustomTypes = useCallback(() => {
    openModal(<CustomTypes />);
  }, []);

  const handleClickDeleteTemplates = useCallback(() => {
    openModal(<DeleteTemplates />);
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

export default CustomObjects;
