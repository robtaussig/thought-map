import React, { FC } from 'react';
import { StatusItem as StatusItemType } from '../../types';
import { STATUS_TO_COLOR } from '../../../Home/Content/ThoughtNode';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface StatusItemProps {
  classes: any;
  statusItem: StatusItemType;
}

export const StatusItem: FC<StatusItemProps> = ({
    classes,
    statusItem,
}) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/thought/${statusItem.thoughtId}`);
    };

    return (
        <>
            <button
                className={classes.statusText}
                onClick={handleClick}
                style={{
                    color: 'white',
                    backgroundColor: STATUS_TO_COLOR[statusItem.status]
                }}
            >
                {statusItem.status}
            </button>
            <div className={classes.thought}>
                <span className={classes.time}>{format(new Date(statusItem.updated), 'p')}</span>
                <span className={classes.title}>{statusItem.title}</span>
            </div>
        </>
    );
};

export default StatusItem;
