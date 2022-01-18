import React, { Fragment, useState, useMemo, FC } from 'react';
import Timeline from '@material-ui/icons/Timeline';
import CircleButton from '../../General/CircleButton';
import Connections from './Connections';
import { Thought } from 'store/rxdb/schemas/thought';
import { Connection } from 'store/rxdb/schemas/connection';

interface CreateConnectionsFromThoughtProps {
  classes: any;
  thought: Thought;
  thoughts: Thought[];
  connections: Connection[];
}

export interface ModifiedConnection {
  id: string;
  thoughtId: string;
}

const SETTING_CONNECTION_STATE = {
  NONE: 1,
  FROM: 2,
  TO: 3,
};

export const CreateConnectionsFromThought: FC<CreateConnectionsFromThoughtProps> = ({ classes, thought, thoughts, connections }) => {
  const [settingConnectionState, setSettingConnectionState] = useState(SETTING_CONNECTION_STATE.NONE);
  const fromConnections = useMemo(() => Object.values(connections).filter(({ to }) => to === thought.id).map<ModifiedConnection>(({ from, id }) => ({ thoughtId: from, id })),[thoughts, connections, thought]);
  const toConnections = useMemo(() => Object.values(connections).filter(({ from }) => from === thought.id).map<ModifiedConnection>(({ to, id }) => ({ thoughtId: to, id })),[thoughts, connections, thought]);

  return (
    <Fragment>
      <Connections
        thought={thought}
        thoughts={thoughts}
        from
        revealed={settingConnectionState === SETTING_CONNECTION_STATE.FROM}
        connections={fromConnections}
      />
      <Connections
        thought={thought}
        thoughts={thoughts}
        to
        revealed={settingConnectionState === SETTING_CONNECTION_STATE.TO}
        connections={toConnections}
      />
      <CircleButton
        classes={classes} 
        id={'from'} 
        onClick={() => setSettingConnectionState(prev => prev === SETTING_CONNECTION_STATE.FROM ?
          SETTING_CONNECTION_STATE.NONE : SETTING_CONNECTION_STATE.FROM
        )}
        label={'Connect From'}
        Icon={Timeline}
      />
      <CircleButton
        classes={classes} 
        id={'to'} 
        onClick={() => setSettingConnectionState(prev => prev === SETTING_CONNECTION_STATE.TO ?
          SETTING_CONNECTION_STATE.NONE : SETTING_CONNECTION_STATE.TO
        )}
        label={'Connect To'}
        Icon={Timeline}
      />
    </Fragment>
  );
};

export default CreateConnectionsFromThought;
