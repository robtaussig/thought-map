import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Connection from './Connection';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: '20vw',
    bottom: '20vw',
    left: 0,
    right: 0,
    transition: 'all 0.1s ease-out',
    borderRadius: '20px',
    backgroundColor: 'white',
    opacity: 0.9,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    flex: 0,
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: 16,
    margin: 40,
  },
  listWrapper: {
    flex: 1,
    overflow: 'hidden',
    width: '50%',
  },
  list: {
    display: 'grid',
    gridAutoRows: 'max-content',
    overflow: 'auto',
    padding: '0 40px',
    marginBottom: 40,
    height: 'calc(100% - 40px)',
  },
  listItem: {
    borderBottom: '1px solid gainsboro',
    display: 'flex',
    '&.connected': {
      color: 'dodgerblue',
    }
  },
  connectedListItem: {
    backgroundColor: 'dodgerblue',
    display: 'flex',
  },
  connectionButton: {
    textAlign: 'left',
    width: '100%',
    '&:active, &:link': {
      backgroundColor: 'dodgerblue',
      color: 'white',
    },
  },
  addConnectionIcon: {
    ...theme.defaults.centered,
  },
});

export const Connections = ({ classes, thought, from, to, revealed, connections, thoughts }) => {
  const INITIAL_STATE = from ? -100 : 100;
  const [positionOfCenter, setPositionOfCenter] = useState(INITIAL_STATE);
  const connectionsMap = connections.reduce((map, connection) => {
    map[connection.thoughtId] = connection.id;
    return map;
  }, {})

  useEffect(() => {
    if (revealed) {
      setPositionOfCenter(from ? -50 : 50);
  
      return () => setPositionOfCenter(INITIAL_STATE);
    }
  }, [revealed]);
  return (
    <section className={classes.root} style={{
      transform: `translateX(${positionOfCenter}%)`,
      alignItems: from ? 'flex-end' : 'flex-start',
    }}>
      <h2 className={classes.header}>{from ? 'Connected From' : 'Connected To'}</h2>
      <div className={classes.listWrapper}>
        <ul className={classes.list}>
          {thoughts.filter(({ id }) => id !== thought.id).map(targetThought => {
            return (
              <Connection
                key={`${targetThought.id}-connection`}
                classes={classes}
                targetThought={targetThought}
                sourceThought={thought}
                connected={connectionsMap[targetThought.id]}
                from={from}
                to={to}
              />
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default withStyles(styles)(Connections);
