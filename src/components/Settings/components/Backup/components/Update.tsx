import React, { FC } from 'react';

interface UpdateProps {
  classes: any;
}

export const Update: FC<UpdateProps> = ({ classes }) => {

  return (
    <div className={classes.update}>
      Coming Soon...
    </div>
  );
};

export default Update;
