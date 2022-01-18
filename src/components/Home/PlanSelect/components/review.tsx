import React, { FC } from 'react';
import { Status } from '../../../../store/rxdb/schemas/Status';
import { Thought } from '../../../../store/rxdb/schemas/Thought';
import {
    ReviewPeriods,
    Stats,
    Snapshot,
    StatusesByThought,
    Statuses,
} from '../types';
import { differenceInCalendarDays } from 'date-fns';
import ReviewStat from './review-stat';

interface ReviewProps {
  classes: any;
  thoughts: Thought[];
  reviewPeriod: ReviewPeriods;
  statusesByThought: StatusesByThought;
  statuses: Statuses;
}

const numDays = {
    [ReviewPeriods.Day]: 1,
    [ReviewPeriods.Week]: 7,
    [ReviewPeriods.Month]: 30,
    [ReviewPeriods.Year]: 365,
};

const isWithinPeriod = (reviewPeriod: ReviewPeriods) => (status: Status) => {
    return differenceInCalendarDays(new Date(), new Date(status.created)) <= numDays[reviewPeriod];
};

export const Review: FC<ReviewProps> = ({ classes, thoughts, reviewPeriod, statusesByThought, statuses }) => {

    const stats = thoughts.reduce((next, { id }) => {
        const thoughtStatuses = statusesByThought[id] || [];
        let didStart = false, didCreate = false, didComplete = false;
        thoughtStatuses
            .map(statusId => statuses[statusId])
            .filter(isWithinPeriod(reviewPeriod))
            .forEach(status => {
                if (status.text === 'new') didCreate = true;
                if (status.text === 'in progress') didStart = true;
                if (status.text === 'completed') didComplete = true;
            });

        if (didComplete && (didStart || didCreate)) {
            next.startedAndCompleted++;
            next.started++;
            next.created++;
            next.completed++;
        } else {
            if (didCreate) next.created++;
            if (didStart) next.started++;
            if (didComplete) next.completed++;
        }

        return next;
    }, { created: 0, started: 0, completed: 0, startedAndCompleted: 0 } as Stats);

    const snapshot = thoughts.reduce((next, { status }) => {
        if (status === 'completed') {
            next.completed++;
        } else if (status === 'new') {
            next.new++;
        } else if (status === 'in progress') {
            next.inProgress++;
        }

        return next;
    }, { inProgress: 0, new: 0, completed: 0 } as Snapshot);

    return (
        <div className={classes.reviewWrapper}>
            <ReviewStat classes={classes} field={'Created'} value={stats.created}/>
            <ReviewStat classes={classes} field={'Started'} value={stats.started}/>
            <ReviewStat classes={classes} field={'Completed'} value={stats.completed}/>
            <ReviewStat classes={classes} field={'Started And Completed'} value={stats.startedAndCompleted}/>
            <hr/>
            <ReviewStat classes={classes} field={'Completed to Date'} value={snapshot.completed}/>
            <ReviewStat classes={classes} field={'Unstarted'} value={snapshot.new}/>
            <ReviewStat classes={classes} field={'In Progress'} value={snapshot.inProgress}/>
        </div>
    );
};

export default Review;
