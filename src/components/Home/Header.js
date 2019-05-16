import React from 'react';
import useApp from '../../hooks/useApp'

export const Header = React.memo(({ classes }) => {
  const { history, dispatch } = useApp();

  return (
    <h1 className={classes.header}>
      ThoughtMap
    </h1>
  );
});

export default Header;
