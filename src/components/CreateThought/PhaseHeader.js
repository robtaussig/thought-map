import React from 'react';

export const PhaseHeader = React.memo(({ classes, value, onClick }) => {

  return (
    <h2 className={classes.phaseHeader} onClick={onClick}>
      {value}
    </h2>
  );
});

export default PhaseHeader;
