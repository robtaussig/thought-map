import React, { FC } from 'react';

interface RetrieveProps {
  classes: any;
}

export const Retrieve: FC<RetrieveProps> = ({ classes }) => {

  return (
    <div className={classes.retrieve}>
      Retrieve
    </div>
  );
};

export default Retrieve;
