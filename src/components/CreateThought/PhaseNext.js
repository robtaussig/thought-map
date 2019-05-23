import React from 'react';

export const PhaseNext = React.memo(({ classes, value, onClick }) => {

  return (
    <button className={classes.phaseNextButton} onClick={onClick}>
      {value}
    </button>
  );
});

export default PhaseNext;
