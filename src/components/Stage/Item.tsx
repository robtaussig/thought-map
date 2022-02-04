import { makeStyles } from '@material-ui/core';
import { DragIndicator, MoreVert } from '@material-ui/icons';
import classNames from 'classnames';
import React, { memo, useContext } from 'react';
import useModal from '../../hooks/useModal';
import { StageContext } from './context';
import Options from './Options';
import { Link } from 'react-router-dom';
import { useHomeUrl } from '../../lib/util';

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.background[200],
    background: theme.palette.background[700],
    '&.isDragging': {
      fontWeight: 600,
      opacity: 0.9,
    },
  },
  dragHandle: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 8px',
  },
  title: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  menu: {
    color: theme.palette.background[200],
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    padding: '0px 8px',
  },
}));

const getStyle = ({ draggableStyle }: any) => {
  const grid = 8;
  const result = {
    userSelect: 'none',
    padding: grid,
    margin: `0 0 ${grid}px 0`,
    ...draggableStyle
  };

  return result;
};

export const Item = ({ provided, item, style, isDragging }: any) => {
  const classes = useStyles();
  const removeThought = useContext(StageContext);
  const [openModal, closeModal] = useModal();
  const homeUrl = useHomeUrl();
  
  const handleOpenMenu = () => {
    openModal(
      <Options
        thought={item}
        onRequestClose={closeModal}
        onRemove={() => removeThought(item.id)}
      />,
      'Stage Options',
    );
  };

  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      style={getStyle({
        draggableStyle: provided.draggableProps.style,
        virtualStyle: style,
        isDragging
      })}
      className={classNames(classes.root, {
        isDragging,
      })}
    >
      <div className={classes.dragHandle}><DragIndicator /></div>
      <Link
        className={classNames(classes.title)}
        to={`${homeUrl}thought/${item.id}`}
      >
        {item.title}
      </Link>
      <button className={classes.menu} onClick={handleOpenMenu}><MoreVert/></button>
    </div>
  );
};

export default memo(Item);
