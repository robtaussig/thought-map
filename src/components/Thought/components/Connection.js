import React from 'react';
import { connections as connectionActions } from '../../../actions';
import { useLoadedDB } from '../../../hooks/useDB';

export const Connection = ({ classes, targetThought, sourceThought, connected, from, to }) => {
  const db = useLoadedDB();

  const handleToggleConnection = () => {
    if (connected) {
      connectionActions.deleteConnection(db, connected);
    } else {
      connectionActions.createConnection(db, {
        from: from ? targetThought.id : sourceThought.id,
        to: from ? sourceThought.id : targetThought.id,
      });
    }
  };

  const isConnected = Boolean(connected);

  return (
    <li className={isConnected ? classes.connectedListItem : classes.listItem}>
      <button className={classes.connectionButton} onClick={handleToggleConnection}>
        {targetThought.title}
      </button>
    </li>
  );
};

export default Connection;