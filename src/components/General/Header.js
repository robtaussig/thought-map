import React from 'react';

export const Header = React.memo(({ classes, value, onClick, ...rest }) => {

  return (
    <h2 className={classes.header} onClick={onClick} {...rest}>
      {value}
    </h2>
  );
});

export default Header;
