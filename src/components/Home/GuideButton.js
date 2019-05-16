import React from 'react';
import useApp from '../../hooks/useApp'

export const GuideButton = React.memo(({ classes }) => {
  const { history, dispatch } = useApp();

  return (
    <button className={classes.guideButton}>
      Guide
    </button>
  );
});

export default GuideButton;
