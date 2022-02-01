import { makeStyles } from '@material-ui/core';
import { DragIndicator } from '@material-ui/icons';
import classNames from 'classnames';
import React, { memo } from 'react';

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
    left: isDragging ? combined.left : combined.left + grid,
    width: isDragging
      ? draggableStyle.width
      : `calc(${combined.width} - ${grid * 2}px)`,
    marginBottom: grid
  };

  return result;
};

export const Item = ({ provided, item, style, isDragging }: any) => {
  const classes = useStyles();

  return (
    <div
      {...provided.draggableProps}
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
      <div {...provided.dragHandleProps} className={classes.dragHandle}><DragIndicator /></div>{item.title}
    </div>
  );
};

export default memo(Item);
