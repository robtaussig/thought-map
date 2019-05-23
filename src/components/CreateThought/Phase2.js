import React from 'react';
import useApp from '../../hooks/useApp'

export const Phase2 = React.memo(({ classes, onNext }) => {
  const { history, dispatch } = useApp();

  return (
    <div className={classes.phase}>

    </div>
  );
});

export default Phase2;
