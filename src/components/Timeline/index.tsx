import React, { FC, useMemo } from 'react';
import { useIdFromUrl } from '../../lib/util';
import { useSelector } from 'react-redux';
import { planSelector } from '../../reducers/plans';
import { statusSelector } from '../../reducers/statuses';
import { thoughtSelector } from '../../reducers/thoughts';
import { Thought } from '../../store/rxdb/schemas/thought';
import { useStyles } from './styles';
import { format } from 'date-fns';
import DailyChunkItem from './DailyChunkItem';
import {
  StatusItem,
  DailyChunk,
} from './types';

interface TimelineProps {
  allPlans?: boolean;
}

export const Timeline: FC<TimelineProps> = ({ allPlans }) => {
  const classes = useStyles({});
  const plans = useSelector(planSelector);
  const thoughts = useSelector(thoughtSelector);
  const statuses = useSelector(statusSelector);
  const planId = useIdFromUrl('plan');
  const header = allPlans ?
    'Timeline' :
    `${plans.find(({ id }) => id === planId)?.name ?? ''} Timeline`.trim();

  const relevantThoughts = useMemo(() => {
    if (allPlans) return thoughts;
  
    return thoughts.filter(thought => thought.planId === planId);
  }, [thoughts, planId, allPlans]);

  const dailyChunks = useMemo(() => {
    const thoughtsById = relevantThoughts
      .reduce((next, thought) => {
        next[thought.id] = thought;
        return next;
      }, {} as { [thoughtId: string]: Thought });

    let currentDailyChunk: DailyChunk;

    return Object.values(statuses)
      .sort((left, right) => left.updated > right.updated ? -1 : 1)
      .reduce((next, { id, updated, text, thoughtId }) => {
        if (thoughtsById[thoughtId]) {            
          const statusItem: StatusItem = {
            id,
            updated,
            status: text,
            title: thoughtsById[thoughtId].title,
            thoughtId,
          };

          const date = format(new Date(updated), 'PPPP');

          if (!currentDailyChunk || currentDailyChunk.date !== date) {
            if (currentDailyChunk) next.push(currentDailyChunk);
            currentDailyChunk = {
              date,
              statusItems: [],
            }
          }
          currentDailyChunk.statusItems.push(statusItem);            
        }

        return next;
      }, [] as DailyChunk[])
  }, [relevantThoughts, statuses]);

  return (
    <div className={classes.root}>
      <h1 className={classes.header}>{header}</h1>
      <ul className={classes.dailyChunks}>
        {dailyChunks.map(({ date, statusItems }) => {
          return (
            <DailyChunkItem
              key={`${date}-chunk`}
              classes={classes}
              date={date}
              statusItems={statusItems}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Timeline;
