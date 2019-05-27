import React from 'react';

export const ThoughtInformation = React.memo(({ classes, thought }) => {

  console.log(thought);
  return (
    <div className={classes.thoughtInformation}>

    </div>
  );
});

export default ThoughtInformation;
