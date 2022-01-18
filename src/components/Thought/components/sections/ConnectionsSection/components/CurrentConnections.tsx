import React, { FC } from 'react';
import { ConnectionSummary } from '../../../../';
import Delete from '@material-ui/icons/Delete';
import { useLoadedDB } from '../../../../../../hooks/useDB';
import { connections as connectionsActions } from '../../../../../../actions';

interface CurrentConnectionsProps {
  classes: any;
  connections: ConnectionSummary[];
}

export const CurrentConnections: FC<CurrentConnectionsProps> = ({ classes, connections }) => {
    const { db } = useLoadedDB();

    const handleDeleteConnection = (connectionId: string) => () => {
        connectionsActions.deleteConnection(db, connectionId);
    };

    return (
        <ul className={classes.currentConnections}>
            {connections
                .sort((left, right) => {
                    if (left.isParent && !right.isParent) return 1;
                    if (right.isParent && left.isParent) return -1;
                    return left.connectionId > right.connectionId ? 1 : -1;
                })
                .map(({ otherThought, connectionId, isParent }, idx) => {
                    return (
                        <li key={`${idx}-connection`} className={classes.currentConnection}>
                            <span className={classes.currentConnectionTitle}>{isParent ? 'To' : 'From'}: {otherThought.title}</span>
                            <button className={classes.deleteConnectionButton} onClick={handleDeleteConnection(connectionId)}><Delete/></button>
                        </li>
                    );
                })}
        </ul>
    );
};

export default CurrentConnections;
