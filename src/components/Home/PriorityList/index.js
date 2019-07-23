import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import useModal from '../../../hooks/useModal';
import PriorityListModal from './components/PriorityListModal';

export const PriorityList = ({ classes, thoughts = [] }) => {
  const [openModal, closeModal] = useModal();
  const [isMinimized, setIsMinimized] = useState(false);
  const hasInitialized = useRef(false);

  const handleMinimize = () => {
    setIsMinimized(true);
    closeModal();
  };

  const openPriorityList = () => {
    setIsMinimized(false);
    openModal(<PriorityListModal classes={classes} onMinimize={handleMinimize} thoughts={thoughts}/>);
  };

  useEffect(() => {
    if (thoughts.length > 0 && hasInitialized.current === false) {
      openPriorityList();
      hasInitialized.current = true;
    }
  }, [thoughts]);

  return isMinimized ? (
    <button className={classes.prioritiesButton} onClick={openPriorityList}>
      Priorities
    </button>
  ) : null;
};

export default withStyles(styles)(PriorityList);
