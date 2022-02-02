import { makeStyles } from '@material-ui/core';
import { DragIndicator, MoreVert } from '@material-ui/icons';
import classNames from 'classnames';
import React, { memo, useContext } from 'react';
import useModal from '../../hooks/useModal';
import { StageContext } from './context';
import Options from './Options';

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.background[200],
    background: theme.palette.background[700],
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

const getStyle = ({ draggableStyle, virtualStyle, isDragging }: any) => {
  // If you don't want any spacing between your items
  // then you could just return this.
  // I do a little bit of magic to have some nice visual space
  // between the row items
  const combined = {
    ...virtualStyle,
    ...draggableStyle
  };

  // Being lazy: this is defined in our css file
  const grid = 8;

  // when dragging we want to use the draggable style for placement, otherwise use the virtual style
  const result = {
    ...combined,
    height: isDragging ? combined.height : combined.height - grid,
    left: combined.left,
    width: isDragging
      ? draggableStyle.width
      : combined.width,
    marginBottom: grid
  };

  return result;
};

export const Item = ({ provided, item, style, isDragging }: any) => {
  const classes = useStyles();
  const removeThought = useContext(StageContext);
  const [openModal, closeModal] = useModal();

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
      <span className={classes.title}>{item.title}</span>
      <button className={classes.menu} onClick={handleOpenMenu}><MoreVert/></button>
    </div>
  );
};

export default memo(Item);
