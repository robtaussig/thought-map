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

  return (
    <nav className={classes.nav}>
      {NAV_OPTIONS.map(navOption => {
        return (
          <button
            key={navOption}
            className={classNames(classes.navOption, {
              selected: currentOption === navOption
            })}
            onClick={() => onChange(navOption)}
          >
            {navOption}
          </button>
        );
      })}
    </nav>
  );
};

export default Nav;
