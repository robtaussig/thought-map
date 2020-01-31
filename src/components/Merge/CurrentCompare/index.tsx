import React, { FC } from 'react';

interface CurrentCompareProps {
  classes: any;
}

export const CurrentCompare: FC<CurrentCompareProps> = ({ classes }) => {

  return (
    <div className={classes.currentCompare}>
      CurrentCompare
    </div>
  );
};

export default CurrentCompare;
