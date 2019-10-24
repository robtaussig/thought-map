import React, { FC, useState } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import ConnectionsModal from '../../Thought/components/sections/ConnectionsSection/components/ConnectionsModal';
import StatusesModal from './StatusesModal';
import VisibilityModal from './VisibilityModal';
import { useModalDynamicState } from '../../../hooks/useModal';
import { AppState } from '../../../reducers';
import classNames from 'classnames';

interface ConnectionsQuickOptionsProps {
  classes: any,
  onClose: () => void;
  thoughtId: string;
  statusOptions: string[];
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 20,
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 150,
    overflow: 'auto',
    justifyContent: 'center',
  },
  nav: {
    paddingBottom: 20,
    marginBottom: 10,
    borderBottom: `1px solid ${theme.palette.secondary[500]}`,
  },
  navItems: {
    display: 'flex',
  },
  navItem: {
    color: theme.palette.gray[400],
    fontWeight: 600,
    display: 'flex',
    '&:not(:first-child)': {
      paddingLeft: 15,
      borderLeft: '1px solid black',
    },
    '&:not(:last-child)': {
      paddingRight: 15,
    },
    '&.active': {
      color: theme.palette.secondary[500],
    },
  },
  navButton: {
    color: 'inherit',
  },
});

enum ViewOptions {
  Connections = 'Connections',
  Statuses = 'Status',
  Visibility = 'Visibility',
}

export const ConnectionsQuickOptions: FC<ConnectionsQuickOptionsProps> = ({ classes, onClose, thoughtId, statusOptions }) => {
  const [currentView, setCurrentView] = useState<ViewOptions>(ViewOptions.Connections);
  const state: AppState = useModalDynamicState();
  const thought = state.thoughts.find(({ id }) => id === thoughtId);

  return (
    <div className={classes.root}>
      <h1 className={classes.header}>{thought.title}</h1>
      <nav className={classes.nav}>
        <ul className={classes.navItems}>
          {[ViewOptions.Connections, ViewOptions.Statuses, ViewOptions.Visibility].map(option => {
            return (
              <li key={option} className={classNames(classes.navItem, {
                active: currentView === option,
              })}>
                <button
                  className={classes.navButton}
                  onClick={() => setCurrentView(option)}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <section className={classes.modalContent}>
        {currentView === ViewOptions.Connections && <ConnectionsModal
          onClose={onClose}
          thoughtId={thoughtId}
          autoFocus={false}
        />}
        {currentView === ViewOptions.Statuses && <StatusesModal
          onClose={onClose}
          thought={thought}
          statusOptions={statusOptions}
        />}
        {currentView === ViewOptions.Visibility && <VisibilityModal
          onClose={onClose}
          thought={thought}
        />}
      </section>
    </div>
  );
};

export default withStyles(styles)(ConnectionsQuickOptions);
