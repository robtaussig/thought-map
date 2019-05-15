import React, { useContext, Fragment } from 'react';
import { Context } from '../store';

export const Thoughts = React.memo(({ thoughts }) => {
  const dispatch = useContext(Context);

  return (
    <Fragment>
      Hello!
    </Fragment>
  );
});

export default Thoughts;
