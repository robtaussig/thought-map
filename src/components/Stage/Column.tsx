import React, { FC, memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Thought } from '../../store/rxdb/schemas/thought';
import ItemList from './ItemList';

interface ColumnProps {
  column: {
    id: string;
    title: string;
    items: Thought[];
  };
  index: number;
}

export const Column: FC<ColumnProps> = ({ column, index }) => {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided: any) => (
        <div
          className="column"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <h3 className="column-title" {...provided.dragHandleProps}>
            {column.title}
          </h3>
          <ItemList column={column} index={index} />
        </div>
      )}
    </Draggable>
  );
};

export default memo(Column);
