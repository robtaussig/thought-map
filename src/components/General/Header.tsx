import React, { FC, MouseEvent } from 'react';

interface HeaderProps {
  classes: any,
  value: string,
  onClick?: (event: MouseEvent<HTMLHeadingElement>) => void,
  [rest: string]: any,
}

export const Header: FC<HeaderProps> = React.memo(({ classes, value, onClick, ...rest }) => {

  return (
    <h2 className={classes.header} onClick={onClick} {...rest}>
      {value}
    </h2>
  );
});

export default Header;
