import React, { FC } from 'react';
import classNames from 'classnames';

interface SideProps {
  classes: any;
  rootClassName: string;
}

export const Side: FC<SideProps> = ({ classes, rootClassName }) => {

  return (
    <div className={classNames(rootClassName, classes.side)}>

    </div>
  );
};

export default Side;
