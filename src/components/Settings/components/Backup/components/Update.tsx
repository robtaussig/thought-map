import React, { FC } from 'react';

interface UpdateProps {
  classes: any;
}

export const Update: FC<UpdateProps> = ({ classes }) => {

  return (
    <div className={classes.update}>
      Update
    </div>
  );
};

export default Update;
