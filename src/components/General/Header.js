import React from 'react';

export const Header = React.memo(({ classes, value, onClick }) => {

  return (
    <h2 className={classes.header} onClick={onClick}>
      {value}
    </h2>
  );
});

export default Header;
