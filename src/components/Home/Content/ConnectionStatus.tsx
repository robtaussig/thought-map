import React, { FC } from 'react';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';

interface ConnectionStatusProps {
  classes: any;
  connectionStatus: [number, number];
  expanded: boolean;
  onToggle: (expand: boolean) => void;
}

export const ConnectionStatus: FC<ConnectionStatusProps> = ({ classes, connectionStatus, expanded, onToggle }) => {
    const [completed, total] = connectionStatus;

    return (
        <div className={classes.connectionStatus} onClick={() => onToggle(!expanded)}>
            <span>{expanded ? (<ExpandMore/>) : (<ExpandLess/>)}</span>
            <span>{completed} / {total}</span>
        </div>
    );
};

export default ConnectionStatus;
