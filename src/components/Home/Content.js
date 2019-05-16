import React from 'react';
import useApp from '../../hooks/useApp'

export const Content = React.memo(({ classes }) => {
  const { history, dispatch } = useApp();

  return (
    <div className={classes.content}>

    </div>
  );
});

export default Content;