import React, { FC, memo, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import ItemList from './ItemList';
import { thoughts as thoughtActions } from '../../actions';
import { Thought } from '../../store/rxdb/schemas/thought';
import { useLoadedDB } from '../../hooks/useDB';
import { format} from 'date-fns';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((_theme: any) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 70px)',
    padding: 20,
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },
  itemHeader: {
    fontWeight: 600,
    fontSize: 20,
    marginBottom: 10,
  },
}));

const getInitialData = (active: Thought[], backlog: Thought[]) => {
  return {
    columns: {
      active: {
        id: 'active',
        title: 'Active',
        items: active,
      },
      backlog: {
        id: 'backlog',
        title: 'Backlog',
        items: backlog,
      },
    } as any,
    columnOrder: ['active', 'backlog'],
  };
};

const reorderList = (list: string[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export interface WrapperProps {
  className?: string;
  activeThoughts: Thought[];
  backlogThoughts: Thought[];
}

export const Wrapper: FC<WrapperProps> = ({
  activeThoughts,
  backlogThoughts,
}) => {
  const classes = useStyles();
  const [state, setState] = useState(() => getInitialData(activeThoughts, backlogThoughts));
  const { db } = useLoadedDB();
  function onDragEnd(result: any) {
    if (!result.destination) {
      return;
    }

    if (result.type === 'column') {
      // if the list is scrolled it looks like there is some strangeness going on
      // with react-window. It looks to be scrolling back to scroll: 0
      // I should log an issue with the project
      const columnOrder = reorderList(
        state.columnOrder,
        result.source.index,
        result.destination.index
      );
      setState({
        ...state,
        columnOrder
      });
      return;
    }

    // reordering in same list
    if (result.source.droppableId === result.destination.droppableId) {
      const column = state.columns[result.source.droppableId];
      const items = reorderList(
        column.items,
        result.source.index,
        result.destination.index
      );

      // updating column entry
      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [column.id]: {
            ...column,
            items
          }
        }
      };
      setState(newState);
      return;
    }

    // moving between lists
    const sourceColumn = state.columns[result.source.droppableId];
    const destinationColumn = state.columns[result.destination.droppableId];
    const item = sourceColumn.items[result.source.index];

    // 1. remove item from source column
    const newSourceColumn = {
      ...sourceColumn,
      items: [...sourceColumn.items]
    };
    newSourceColumn.items.splice(result.source.index, 1);

    // 2. insert into destination column
    const newDestinationColumn = {
      ...destinationColumn,
      items: [...destinationColumn.items]
    };
    // in line modification of items
    newDestinationColumn.items.splice(result.destination.index, 0, item);

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestinationColumn.id]: newDestinationColumn
      }
    };

    setState(newState);
    thoughtActions.editThought(db, {
      ...item,
      stagedOn: destinationColumn.id === 'active' ? format(new Date(), 'yyyy-MM-dd') : ''
    });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="all-droppables"
        direction="horizontal"
        type="column"
      >
        {provided => (
          <div
            className={classes.root}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {state.columnOrder.map((columnId, index) => (
              <div className={classes.itemList} key={columnId}>
                <h2 className={classes.itemHeader}>{state.columns[columnId].title}</h2>
                <ItemList
                  key={columnId}
                  column={state.columns[columnId]}
                  index={index}
                />
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default memo(Wrapper);
