import React, { FC } from 'react';
import { useStyles } from './styles';
import cn from 'classnames';

export interface PrivacyPolicyProps {
  className?: string;
}

export const PrivacyPolicy: FC<PrivacyPolicyProps> = ({
  className,
}) => {
  const classes = useStyles({});

  return (
    <div className={cn(classes.root, className)}>
      <h1 className={classes.header}>Privacy Policy</h1>
      <p className={classes.text}>We do not collect your data, period. The cloud backup feature offered by the app encrypts your data first using a key of your making, meaning that the only you, or someone with the key, can read it.</p>
    </div>
  );
};

export default PrivacyPolicy;
