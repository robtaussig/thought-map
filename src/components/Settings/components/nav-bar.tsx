import React, { FC } from 'react';
import classNames from 'classnames';
import { withStyles, StyleRules } from '@material-ui/core/styles';

interface NavBarProps {
  classes: any;
  items: any[];
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flex: '0 0 80px',
    boxShadow: '0px 3px 7px 2px black',
  },
  navItem: {
    flex: 1,
    fontSize: 24,
    backgroundColor: theme.palette.gray[200],
    '&.current': {
      backgroundColor: theme.palette.primary[500],
      boxShadow: '0px 0px 5px 0px black',
      zIndex: 1,
    },
    '&[disabled]': {
      color: 'black',
    },
  },
});

export const NavBar: FC<NavBarProps> = ({ classes, items }) => {

  return (
    <nav className={classes.root}>
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

export default withStyles(styles)(NavBar);
