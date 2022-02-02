import { makeStyles } from '@material-ui/core';
import React, { FC, memo, useLayoutEffect, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { FixedSizeList } from 'react-window';
import { Thought } from '../../store/rxdb/schemas/thought';
import Item from './Item';
import Row from './Row';

interface ItemListProps {
  column: {
    id: string;
    title: string;
    items: Thought[];
  };
  index: number;
}

const useStyles = makeStyles((_theme: any) => ({
  root: {

  },
}));

export const ItemList: FC<ItemListProps> = ({ column, index }) => {
  const classes = useStyles();
  const listRef = useRef<FixedSizeList>();

  useLayoutEffect(() => {
    const list = listRef.current;
    if (list) {
      list.scrollTo(0);
    }
  }, [index]);

  return (
    <Droppable
      droppableId={column.id}
      mode="virtual"
      renderClone={(provided, snapshot, rubric) => (
        <Item
          provided={provided}
          isDragging={snapshot.isDragging}
          item={column.items[rubric.source.index]}
        />
      )}
    >
      {(provided, snapshot) => {
        // Add an extra item to our list to make space for a dragging item
        // Usually the DroppableProvided.placeholder does this, but that won't
        // work in a virtual list
        const itemCount = snapshot.isUsingPlaceholder
          ? column.items.length + 1
          : column.items.length;

        return (
          <FixedSizeList
            height={Math.max(itemCount * 50, 50)}
            itemCount={itemCount}
            itemSize={50}
            width={'100%'}
            outerRef={provided.innerRef}
            itemData={column.items}
            className={classes.root}
            ref={listRef}
          >
            {Row}
          </FixedSizeList>
        );
      }}
    </Droppable>
  );
};

export default memo(ItemList);
