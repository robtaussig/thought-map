import React, { FC, memo, useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import ItemList from './ItemList';
import { thoughts as thoughtActions } from '../../actions';
import { Thought } from '../../store/rxdb/schemas/thought';
import { useLoadedDB } from '../../hooks/useDB';
import { format, startOfYesterday} from 'date-fns';
import { makeStyles } from '@material-ui/core';
import { getInitialData, reorderList } from './util';
import { StageContext } from './context';
import produce from 'immer';
import { useLatestThought } from '../../hooks/useLatestThought';

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
    overflow: 'hidden',
  },
  itemHeader: {
    fontWeight: 600,
    fontSize: 20,
    marginBottom: 10,
  },
}));

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
  const latestThought = useLatestThought();

  const onRemoveThought = (thoughtId: string) => {
    setState(prev => produce(prev, (draftState) => {
      draftState.columns.active.items = draftState.columns.active.items.filter(({ id }) => {
        return id !== thoughtId;
      });
      draftState.columns.backlog.items = draftState.columns.backlog.items.filter(({ id }) => {
        return id !== thoughtId;
      });

      return draftState;
    }));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    if (result.type === 'column') {
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

    if (result.source.droppableId === result.destination.droppableId) {
      const column = state.columns[result.source.droppableId];
      const items = reorderList(
        column.items,
        result.source.index,
        result.destination.index
      );

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

    const sourceColumn = state.columns[result.source.droppableId];
    const destinationColumn = state.columns[result.destination.droppableId];
    const item = {
      ...sourceColumn.items[result.source.index],
      stagedOn: destinationColumn.id === 'active'
        ? format(new Date(), 'yyyy-MM-dd')
        : format(startOfYesterday(), 'yyyy-MM-dd'),
      stageIndex: result.destination.index,
    };

    const newSourceColumn = {
      ...sourceColumn,
      items: [...sourceColumn.items]
    };
    newSourceColumn.items.splice(result.source.index, 1);

    const newDestinationColumn = {
      ...destinationColumn,
      items: [...destinationColumn.items]
    };
    newDestinationColumn.items.splice(result.destination.index, 0, item);

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestinationColumn.id]: newDestinationColumn
      }
    };

    thoughtActions.editThought(db, {
      ...item,
      
    });
    setState(newState);
  };

  const onDragStart = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  };
  
  useEffect(() => {
    if (
      latestThought?.stagedOn === format(new Date(), 'yyyy-MM-dd') && latestThought.status !== 'completed') {
      setState(prev => produce(prev, (draftState) => {
        if (!draftState.columns.active.items.find(({ id }) => {
          return id === latestThought.id;
        })) {
          draftState.columns.active.items.unshift(latestThought);
          return draftState;
        } else {
          return draftState;
        }
      }));
    }
  }, [latestThought]);

  useEffect(() => {
    Object.values(state.columns).forEach(({ items }) => {
      items.forEach((item, idx) => {
        if (item.stageIndex - 1 !== idx) {
          thoughtActions.editThought(db, {
            ...item,
            stageIndex: idx + 1,
          });
        }
      });
    });
  }, [state]);

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <StageContext.Provider value={onRemoveThought}>
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
      </StageContext.Provider>
    </DragDropContext>
  );
};

export default memo(Wrapper);
