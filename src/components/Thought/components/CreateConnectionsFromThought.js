import React, { Fragment, useState, useMemo, useEffect } from 'react';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import CircleButton from '../../General/CircleButton';
import Connections from './Connections.js';

const SETTING_CONNECTION_STATE = {
  NONE: 1,
  FROM: 2,
  TO: 3,
};

export const CreateConnectionsFromThought = ({ classes, thought, thoughts, connections }) => {
  const [settingConnectionState, setSettingConnectionState] = useState(SETTING_CONNECTION_STATE.NONE);
  const fromConnections = useMemo(() => Object.values(connections).filter(({ to }) => to === thought.id).map(({ title, from, id }) => ({ title, thoughtId: from, id })),[thoughts, connections, thought]);
  const toConnections = useMemo(() => Object.values(connections).filter(({ from }) => from === thought.id).map(({ title, to, id }) => ({ title, thoughtId: to, id })),[thoughts, connections, thought]);

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
        Icon={ChevronLeft}
      />
      <CircleButton
        classes={classes} 
        id={'to'} 
        onClick={() => setSettingConnectionState(prev => prev === SETTING_CONNECTION_STATE.TO ?
          SETTING_CONNECTION_STATE.NONE : SETTING_CONNECTION_STATE.TO
        )}
        label={'Connect To'}
        Icon={ChevronRight}
      />
    </Fragment>
  );
};

export default CreateConnectionsFromThought;
