import React, { useContext, Fragment } from 'react';
import { Context } from '../store';

export const Connections = React.memo(({ connections }) => {
  const dispatch = useContext(Context);

  return (
    <Fragment>
      Hello!
    </Fragment>
  );
});

export default Connections;
