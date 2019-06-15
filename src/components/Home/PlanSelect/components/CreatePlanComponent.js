import React, { useEffect, useState, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CREATE_NEW_PLAN } from '../';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    transition: 'all 0.3s ease-out',
    backgroundColor: '#8380ff',      
    borderRadius: '10px',
    visibility: 'hidden',
  },
  header: {
    color: 'white',
    fontSize: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 50px',
  },
});

export const CreatePlanComponent = ({ classes, open }) => {
  const [style, setStyle] = useState({});
  const rootRef = useRef(null);

  useEffect(() => {
    const { x, y, height } = rootRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const distanceToBottom = windowHeight - y - height;

    if (open) {
      setStyle({
        top: -y,
        left: -x,
        right: -x,
        bottom: -distanceToBottom,
        borderRadius: 0,
        justifyContent: 'flex-start',
        visibility: 'visible',
      });
    } else {

    }
  }, [open]);

  return (
    <div ref={rootRef} className={classes.root} style={style}>
      <h2 className={classes.header}>{CREATE_NEW_PLAN}</h2>
    </div>
  );
};

export default withStyles(styles)(CreatePlanComponent);