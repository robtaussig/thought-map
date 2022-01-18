import React, { useEffect, useState, FC } from 'react';
import { withStyles, StyleRules } from '@material-ui/core/styles';
import Connection from './Connection';
import { Thought } from 'store/rxdb/schemas/thought';
import { ModifiedConnection } from './CreateConnectionsFromThought';

interface ConnectionsProps {
  classes: any;
  thought: Thought;
  from?: boolean;
  to?: boolean;
  revealed: boolean;
  connections: ModifiedConnection[];
  thoughts: Thought[];
}

interface ConnectionMap {
  [id: string]: string;
}

const styles = (theme: any): StyleRules => ({
    root: () => ({
        position: 'absolute',
        top: '20%',
        bottom: '20%',
        left: 0,
        right: 0,
        transition: 'all 0.1s ease-out',
        borderRadius: '20px',
        backgroundColor: theme.palette.background[0],
        opacity: 0.9,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    }),
    header: {
        flex: 0,
        textTransform: 'uppercase',
        fontWeight: 600,
        fontSize: 16,
        margin: 40,
    },
    listWrapper: {
        flex: 1,
        overflow: 'hidden',
        width: '50%',
    },
    list: {
        display: 'grid',
        gridAutoRows: 'max-content',
        overflow: 'auto',
        padding: '0 40px',
        marginBottom: 40,
        height: 'calc(100% - 40px)',
    },
    listItem: {
        borderBottom: '1px solid gainsboro',
        display: 'flex',
        '&.connected': {
            color: 'dodgerblue',
        }
    },
    connectedListItem: {
        backgroundColor: 'dodgerblue',
        display: 'flex',
    },
    connectionButton: () => ({
        textAlign: 'left',
        width: '100%',
        '&:active, &:link': {
            backgroundColor: 'dodgerblue',
            color: theme.palette.background[0],
        },
    }),
    addConnectionIcon: {
        ...theme.defaults.centered,
    },
});

export const Connections: FC<ConnectionsProps> = ({ classes, thought, from, to, revealed, connections, thoughts }) => {
    const INITIAL_STATE = from ? -100 : 100;
    const [positionOfCenter, setPositionOfCenter] = useState(INITIAL_STATE);
    const connectionsMap = connections.reduce((map, connection) => {
        map[connection.thoughtId] = connection.id;
        return map;
    }, {} as ConnectionMap);

    useEffect(() => {
        if (revealed) {
            setPositionOfCenter(from ? -50 : 50);

            return () => setPositionOfCenter(INITIAL_STATE);
        }
    }, [revealed]);
    return (
        <section className={classes.root} style={{
            transform: `translateX(${positionOfCenter}%)`,
            alignItems: from ? 'flex-end' : 'flex-start',
        }}>
            <h2 className={classes.header}>{from ? 'Connect From' : 'Connect To'}</h2>
            <div className={classes.listWrapper}>
                <ul className={classes.list}>
                    {thoughts.filter(({ id }) => id !== thought.id).map(targetThought => {
                        return (
                            <Connection
                                key={`${targetThought.id}-connection`}
                                classes={classes}
                                targetThought={targetThought}
                                sourceThought={thought}
                                connected={connectionsMap[targetThought.id]}
                                from={from}
                                to={to}
                            />
                        );
                    })}
                </ul>
            </div>
        </section>
    );
};

export default withStyles(styles)(Connections);
