import React, { FC } from 'react';
import { History } from 'history';
import { StatusItem as StatusItemType } from '../types';
import StatusItem from './StatusItem';

interface DailyChunkItemProps {
  classes: any;
  date: string;
  statusItems: StatusItemType[];
  history: History<any>;
}

export const DailyChunkItem: FC<DailyChunkItemProps> = ({
  classes,
  date,
  statusItems,
  history,
}) => {

  return (
    <div className={classes.dailyChunk}>
      <div className={classes.date}>{date}</div>
      {statusItems.map(statusItem => {
        return (
          <StatusItem
            key={statusItem.id}
            classes={classes}
            statusItem={statusItem}
            history={history}
          />
        );
      })}
    </div>
  );
};

export default DailyChunkItem;
