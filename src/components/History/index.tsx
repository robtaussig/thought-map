import React, { FC, useMemo, useRef, useState, useEffect } from 'react';
import { withStyles, StyleRules, CSSProperties } from '@material-ui/styles';
import { AppState } from '../../reducers';
import { getIdFromUrl } from '../../lib/util';
import useApp from '../../hooks/useApp';
import ThoughtGroup from './components/thought-group';
import Grapher, {
  ThoughtsById,
} from '../Connections/lib/grapher';
import {
  StatusUpdate,
  Group,
} from './types';

interface HistoryProps {
  classes: any;
  state: AppState;
  statusOptions: string[];
}

const styles = (theme: any): StyleRules => ({
  root: {
    backgroundColor: theme.palette.gray[700],
  },
});

export const History: FC<HistoryProps> = ({ classes, state, statusOptions }) => {
  const { history } = useApp();
  const grapher = useRef(null);
  const [relatedThoughtIds, setRelatedThoughtIds] = useState<string[]>([]);

  const getGrapher = (): Grapher => {
    if (grapher.current === null) {
      grapher.current = new Grapher();
    }

    return grapher.current;
  }
  const isPlanHistory = /thought/.test(history.location.pathname) === false;
  const planId = getIdFromUrl(history, 'plan');
  const thoughtId = getIdFromUrl(history, 'thought');
  const plan = useMemo(() => {
    return state.plans.find(({ id }) => id === planId);
  }, [state.plans, planId]);
  const thought = useMemo(() => {
    return state.thoughts.find(({ id }) => id === thoughtId);
  }, [state.thoughts, thoughtId]);
  const thoughtsById = useMemo(() => {
    return state.thoughts.reduce((byId, thought) => {
      byId[thought.id] = thought;
      return byId;
    }, {} as ThoughtsById);
  }, [state.thoughts]);

  useEffect(() => {
    if (isPlanHistory) {

    } else {
      getGrapher()
        .update(thought, state.connections)
        .getDescendents(setRelatedThoughtIds);
    }
  }, [state.connections, state.thoughts, planId, thoughtId, isPlanHistory, thoughtsById]);

  const statusUpdates = useMemo(() => {
    return relatedThoughtIds.reduce((next, relatedThoughtId) => {
      const thought = state.thoughts.find(({ id }) => id === relatedThoughtId);
      const statusesByThought: StatusUpdate[] = state.statusesByThought[relatedThoughtId]
                                  .map(statusId => {
                                    const status = state.statuses[statusId];
                                    const completionIndex = statusOptions.indexOf(status.text);

                                    return {
                                      thoughtId: relatedThoughtId,
                                      status: status.text,
                                      completionIndex: [completionIndex, statusOptions.length - 1],
                                      thoughtTitle: thought.title,
                                      location: status.location,
                                      created: status.created,
                                      isSelectedThought: relatedThoughtId === thoughtId,
                                    };
                                  });
      next = next.concat(statusesByThought);
      return next;
    }, [] as StatusUpdate[])
      .sort((a, b) => {
        if (a.created > b.created) return 1;
        return -1;
      });
  }, [state.statusesByThought, state.statuses, relatedThoughtIds]);

  const groupedByThought: Group[] = useMemo(() => {
    return statusUpdates.reduce((next, statusUpdate, statusUpdateIndex) => {
      const grouping = next.find(group => group[0].thoughtId === statusUpdate.thoughtId);
      if (grouping) {
        grouping.push({
          ...statusUpdate,
          statusUpdateIndex: [statusUpdateIndex, statusUpdates.length - 1],
          thoughtIndex: grouping[0].thoughtIndex,
        });
      } else {
        next.push([{
          ...statusUpdate,
          statusUpdateIndex: [statusUpdateIndex, statusUpdates.length - 1],
          thoughtIndex: [next.length, relatedThoughtIds.length - 1],
        }]);
      }

      return next;
    }, []);
  }, [statusUpdates, relatedThoughtIds]);

  const gridStyle: CSSProperties = useMemo(() => {
    const columnCount = groupedByThought[0] ? groupedByThought[0][0].thoughtIndex[1] + 1 : 1;
    const rowCount = groupedByThought[0] ? groupedByThought[0][0].statusUpdateIndex[1] + 1: 1;

    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${columnCount}, ${100 / columnCount}%)`,
      gridTemplateRows: `repeat(${rowCount}, ${100 / rowCount}%)`,
      height: '100%',
      width: '100%',
    };
  }, [groupedByThought]);

  return (
    <div className={classes.root} style={gridStyle}>
      {groupedByThought.map((group, idx) => {
        return (
          <ThoughtGroup key={`${idx}-thought-group`} group={group}/>
        );
      })}
    </div>
  );
};

export default withStyles(styles)(History);
