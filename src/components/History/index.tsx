import React, { FC, useMemo, CSSProperties } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { useIdFromUrl } from '../../lib/util';
import ThoughtGroup from './components/thought-group';
import {
    StatusUpdate,
    Group,
} from './types';
import { useSelector } from 'react-redux';
import { thoughtSelector } from '../../reducers/thoughts';
import { statusesByThoughtSelector } from '../../reducers/statusesByThought';
import { statusSelector } from '../../reducers/statuses';
import useThoughtMap from '../../hooks/useThoughtMap';

interface HistoryProps {
  classes: any;
  statusOptions: string[];
}

const styles = (theme: any): StyleRules => ({
    root: () => ({
        backgroundColor: theme.palette.background[700],
    }),
});

export const History: FC<HistoryProps> = ({ classes, statusOptions }) => {
    const thoughts = useSelector(thoughtSelector);
    const stateStatusesByThought = useSelector(statusesByThoughtSelector);
    const statuses = useSelector(statusSelector);
    const thoughtId = useIdFromUrl('thought');
    const { descendants } = useThoughtMap(thoughtId as string);
    const statusUpdates = useMemo(() => {
        return descendants.reduce((next, relatedThoughtId) => {
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
    }, [stateStatusesByThought, statuses, descendants]);

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
                    thoughtIndex: [next.length, descendants.length - 1],
                }]);
            }

            return next;
        }, []);
    }, [statusUpdates, descendants]);

    const gridStyle: CSSProperties = useMemo(() => {
        const columnCount = Math.max(groupedByThought[0] ? groupedByThought[0][0].thoughtIndex[1] + 1 : 0, 2);
        const rowCount = groupedByThought[0] ? groupedByThought[0][0].statusUpdateIndex[1] + 1 : 1;

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
                    <ThoughtGroup key={`${idx}-thought-group`} group={group} statusOptions={statusOptions} />
                );
            })}
        </div>
    );
};

export default withStyles(styles)(History);
