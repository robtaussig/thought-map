import React, { FC } from 'react';
import classNames from 'classnames';

interface NavBarProps {
  classes: any,
  items: any[],
}

export const NavBar: FC<NavBarProps> = ({ classes, items }) => {

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
