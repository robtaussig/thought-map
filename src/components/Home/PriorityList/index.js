import React, { useEffect, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import useModal from '../../../hooks/useModal';
import PriorityListModal from './components/PriorityListModal';

export const PriorityList = ({ classes, thoughts = [] }) => {
  const [openModal, closeModal] = useModal();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (thoughts.length > 0 && hasInitialized.current === false) {
      openModal(<PriorityListModal classes={classes} onClose={closeModal} thoughts={thoughts}/>);
      hasInitialized.current = true;
    }
  }, [thoughts]);

  return null;
};

export default withStyles(styles)(PriorityList);
