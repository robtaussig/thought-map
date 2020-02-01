import React, { FC } from 'react';

interface MergedProps {
  classes: any;
}

export const Merged: FC<MergedProps> = ({ classes }) => {

  return (
    <div className={classes.merged}>

    </div>
  );
};

export default Merged;
