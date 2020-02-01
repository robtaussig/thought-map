import React, { FC } from 'react';

interface ParentThoughtProps {
  classes: any;
}

export const ParentThought: FC<ParentThoughtProps> = ({ classes }) => {

  return (
    <div className={classes.parentThought}>

    </div>
  );
};

export default ParentThought;
