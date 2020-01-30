import React, { useState, FC } from 'react';
import { connections as connectionActions } from '../../../actions';
import { useLoadedDB } from '../../../hooks/useDB';
import { useApp } from '../../../hooks/useApp';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import { Thought } from 'store/rxdb/schemas/thought';

interface ConnectionProps {
  classes: any;
  targetThought: Thought;
  sourceThought: Thought;
  connected?: string;
  from: boolean;
  to: boolean;
}

export const Connection: FC<ConnectionProps> = ({ classes, targetThought, sourceThought, connected, from, to }) => {
  const { db } = useLoadedDB();
  const [loading, setLoading] = useState(false);
  const { history } = useApp();

  const handleToggleConnection = async () => {
    setLoading(true);
    if (connected) {
      await connectionActions.deleteConnection(db, connected);
    } else {
      await connectionActions.createConnection(db, {
        from: from ? targetThought.id : sourceThought.id,
        to: from ? sourceThought.id : targetThought.id,
      });
    }
    setLoading(false);
  };

  const handleGoToThought = () => {
    history.push(`/thought/${targetThought.id}`);
  };

  const isConnected = Boolean(connected);

  return (
    <li className={isConnected ? classes.connectedListItem : classes.listItem}>
      <button className={classes.connectionButton} onClick={handleGoToThought}>
        {targetThought.title}
      </button>
      <button className={classes.addConnectionIcon} onClick={handleToggleConnection} disabled={loading}>
        {connected ? <Remove/> : <Add/>}
      </button>
    </li>
  );
};

export default Connection;
