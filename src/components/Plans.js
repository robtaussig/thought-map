import React, { useContext, Fragment } from 'react';
import { Context } from '../store';

export const Plans = React.memo(({ plans }) => {
  const dispatch = useContext(Context);

  return (
    <Fragment>
      Hello!
    </Fragment>
  );
});

export default Plans;
