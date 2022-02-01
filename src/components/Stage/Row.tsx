import React, { CSSProperties, FC, memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Thought } from '../../store/rxdb/schemas/thought';
import Item from './Item';
import { areEqual } from 'react-window';

interface RowProps {
  data: Thought[];
  index: number;
  style: CSSProperties;
}

export const Row: FC<RowProps> = ({ data: items, index, style }) => {
  const item = items[index];

  // We are rendering an extra item for the placeholder
  if (!item) {
    return null;
  }

  return (
    <Draggable draggableId={item.id} index={index} key={item.id}>
      {provided => <Item provided={provided} item={item} style={style} />}
    </Draggable>
  );
};

export default memo(Row, areEqual);
