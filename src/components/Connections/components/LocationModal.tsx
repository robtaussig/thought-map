import React, { FC } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import Map from '../../General/Map';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { useModalDynamicState } from '../../../hooks/useModal';
import { AppState } from '../../../reducers';
import { format } from 'date-fns';

interface LocationModalProps {
  classes: any;
  thought: Thought;
  onClose: () => void;
}

const styles = (theme: any): StyleRules => ({
  root: {
    height: '100%',
  },
  mapSection: {
    height: 250,
    '&:not(:last-child)': {
      marginBottom: 20,
    },
  },
  statusText: {
    fontWeight: 600,
  },
});

export const LocationModal: FC<LocationModalProps> = ({ classes, thought, onClose }) => {
  const state: AppState = useModalDynamicState();
  const statusIds = state.statusesByThought[thought.id];
  const statuses = statusIds.map(statusId => {
    return state.statuses[statusId];
  });

  return (
    <div className={classes.root}>
      {statuses
        .filter(({ location }) => Boolean(location))
        .sort((a, b) => a.created - b.created)
        .map(({ id, location, text, created }) => {
          const [latitude, longitude] = location.split(',');

          return (
            <section key={id} className={classes.mapSection}>
              <span className={classes.statusText}>
                {`[${format(new Date(created), 'yyyy-MM-dd HH:mm')}] ${text}`}
              </span>
              <Map
                latitude={Number(latitude)}
                longitude={Number(longitude)}
              />
            </section>
          );
      })}
    </div>
  );
};

export default withStyles(styles)(LocationModal);
