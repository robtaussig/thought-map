import React, { FC } from 'react';
import { NavOptions } from '../types';
import { NAV_OPTIONS } from '../constants';
import classNames from 'classnames';

interface NavProps {
  classes: any;
  currentOption: NavOptions;
  onChange: (option: NavOptions) => void;
}

export const Nav: FC<NavProps> = ({ classes, currentOption, onChange }) => {

  const handleClick = (navOption: NavOptions) => () => {
    onChange(navOption);
  };

  return (
    <nav className={classNames(classes.nav, {
      initial: currentOption === null,
    })}>
      {NAV_OPTIONS.map(navOption => {
        return (
          <button
            key={navOption}
            className={classNames(classes.navOption, {
              selected: currentOption === navOption
            })}
            onClick={handleClick(navOption)}
          >
            {navOption}
          </button>
        );
      })}
    </nav>
  );
};

export default Nav;
