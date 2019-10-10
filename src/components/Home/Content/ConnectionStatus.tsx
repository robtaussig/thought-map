import React, { FC } from 'react';

interface ConnectionStatusProps {
  classes: any;
  connectionStatus: [number, number];
}

export const ConnectionStatus: FC<ConnectionStatusProps> = ({ classes, connectionStatus }) => {
  const [completed, total] = connectionStatus;

  return (
    <div className={classes.connectionStatus}>
      {completed} / {total}
    </div>
  );
};

export default ConnectionStatus;
