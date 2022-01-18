import React, { FC } from 'react';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { format } from 'date-fns';

interface ParentThoughtProps {
  classes: any;
  thought: Thought;
}

export const ParentThought: FC<ParentThoughtProps> = ({ classes, thought }) => {

    return (
        <div className={classes.parentThought}>
            <h2 className={'header'}>Parent Thought</h2>
            <span className={'title-field'}>
        Title
            </span>
            <span className={'title-value'}>
                {thought.title}
            </span>
            <span className={'status-field'}>
        Status
            </span>
            <span className={'status-value'}>
                {thought.status}
            </span>
            <span className={'created-field'}>
        Created
            </span>
            <span className={'created-value'}>
                {format(thought.created, 'yyyy-MM-dd HH:mm')}
            </span>
        </div>
    );
};

export default ParentThought;
