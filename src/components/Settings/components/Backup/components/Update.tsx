import React, { FC, MutableRefObject } from 'react';

interface UpdateProps {
  classes: any;
  rootRef: MutableRefObject<HTMLDivElement>;
}

export const Update: FC<UpdateProps> = ({ classes, rootRef }) => {

  return (
    <div className={classes.update}>
      Coming Soon...
    </div>
  );
};

export default Update;
