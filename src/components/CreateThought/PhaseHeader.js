import React from 'react';

export const PhaseHeader = React.memo(({ classes, value }) => {

  return (
    <h2 className={classes.phaseHeader}>
      {value}
    </h2>
  );
});

export default PhaseHeader;
