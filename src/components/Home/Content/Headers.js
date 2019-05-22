import React, { Fragment } from 'react';
import useApp from '../../../hooks/useApp'

export const Headers = React.memo(({ classes }) => {
  const { history, dispatch } = useApp();

  return (
    <Fragment>
      <h3>Title</h3>
      <h3>Description</h3>
      <h3>Type</h3>
      <h3>Status</h3>
    </Fragment>
  );
});

export default Headers;
