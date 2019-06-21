import React from 'react';
import classNames from 'classnames';

export const NavBar = ({ classes, items }) => {

  return (
    <nav className={classes.nav}>
      {items.map(({ current, value, onClick, ...props }, idx) => {
        return (
          <button
            key={`${idx}-nav-button`}
            className={classNames(classes.navItem, {
              current,
            })}
            onClick={onClick}
            {...props}
          >
            {value}
          </button>
        );
      })}
    </nav>
  );
};

export default NavBar;
