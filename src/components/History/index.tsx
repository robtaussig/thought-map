import React, { FC, useMemo, useRef, useState, useEffect } from 'react';
import { withStyles, StyleRules, CSSProperties } from '@material-ui/styles';
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
import { useSelector } from 'react-redux';
import { planSelector } from '../../reducers/plans';
import { thoughtSelector } from '../../reducers/thoughts';
import { connectionSelector } from '../../reducers/connections';
import { statusesByThoughtSelector } from '../../reducers/statusesByThought';
import { statusSelector } from '../../reducers/statuses';
import { proxy, wrap, releaseProxy } from 'comlink';

interface HistoryProps {
  classes: any;
  statusOptions: string[];
}

const styles = (theme: any): StyleRules => ({
  root: {
    backgroundColor: theme.palette.gray[700],
  },
});

export const History: FC<HistoryProps> = ({ classes, statusOptions }) => {
  const { history } = useApp();
  const [relatedThoughtIds, setRelatedThoughtIds] = useState<string[]>([]);
  const plans = useSelector(planSelector);
  const thoughts = useSelector(thoughtSelector);
  const connections = useSelector(connectionSelector);
  const stateStatusesByThought = useSelector(statusesByThoughtSelector);
  const statuses = useSelector(statusSelector);
  const isPlanHistory = /thought/.test(history.location.pathname) === false;
  const planId = getIdFromUrl(history, 'plan');
  const thoughtId = getIdFromUrl(history, 'thought');
  const thought = useMemo(() => {
    return thoughts.find(({ id }) => id === thoughtId);
  }, [thoughts, thoughtId]);
  const thoughtsById = useMemo(() => {
    return thoughts.reduce((byId, thought) => {
      byId[thought.id] = thought;
      return byId;
    }, {} as ThoughtsById);
  }, [thoughts]);

  useEffect(() => {
    if (isPlanHistory) {

    } else {
      const WorkerGrapher = wrap<Grapher>(
        new Worker('../Connections/lib/worker.ts')
      );
  
      const processData = async () => {
        //@ts-ignore   
        const instance = await new WorkerGrapher();
        await instance.update(thought, connections);
        instance.generate(proxy(setRelatedThoughtIds), thoughtsById);
      };
  
      processData();
  
      return () => WorkerGrapher[releaseProxy]();
    }
  }, [connections, thoughts, planId, thoughtId, isPlanHistory, thoughtsById]);

  const statusUpdates = useMemo(() => {
    return relatedThoughtIds.reduce((next, relatedThoughtId) => {
      const thought = thoughts.find(({ id }) => id === relatedThoughtId);
      const statusesByThought: StatusUpdate[] = (stateStatusesByThought[relatedThoughtId] || [])
                                  .map(statusId => {
                                    const status = statuses[statusId];
                                    const completionIndex = statusOptions.indexOf(status.text);

                                    return {
                                      thoughtId: relatedThoughtId,
                                      statusId,
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
  }, [stateStatusesByThought, statuses, relatedThoughtIds]);

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
    const columnCount = Math.max(groupedByThought[0] ? groupedByThought[0][0].thoughtIndex[1] + 1 : 0, 2);
    const rowCount = groupedByThought[0] ? groupedByThought[0][0].statusUpdateIndex[1] + 1: 1;

    return {
      display: 'grid',
      gridTemplateColumns: columnCount > 1 ?
        `repeat(${Math.max(3, columnCount)}, ${100 / Math.max(3, columnCount)}%)` :
        '50px 1fr',
      gridTemplateRows: `repeat(${rowCount}, minmax(max-content, ${100 / rowCount}%))`,
      height: '100%',
      width: '100%',
      overflow: 'auto',
    };
  }, [groupedByThought]);

  return (
    <div className={classes.root} style={gridStyle}>
      {groupedByThought.map((group, idx) => {
        return (
          <ThoughtGroup key={`${idx}-thought-group`} group={group} statusOptions={statusOptions}/>
        );
      })}
    </div>
  );
};

export default withStyles(styles)(History);
