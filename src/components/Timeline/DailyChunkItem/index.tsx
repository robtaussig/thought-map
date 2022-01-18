import React, { FC } from 'react';
import { StatusItem as StatusItemType } from '../types';
import StatusItem from './StatusItem';

interface DailyChunkItemProps {
  classes: any;
  date: string;
  statusItems: StatusItemType[];
}

export const DailyChunkItem: FC<DailyChunkItemProps> = ({
    classes,
    date,
    statusItems,
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
                    />
                );
            })}
        </div>
    );
};

export default DailyChunkItem;
