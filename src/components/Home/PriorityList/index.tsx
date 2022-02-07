import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import useModal from '../../../hooks/useModal';
import PriorityListModal from './components/PriorityListModal';
import { thoughtSelector } from '../../../reducers/thoughts';
import { useDispatch } from 'react-redux';
import { toggle } from '../../../reducers/displayPriorities';
import { useIdFromUrl } from '../../../lib/util';
import { useTypedSelector } from '../../../reducers';

interface PriorityListProps {
  classes: any;
}
export const PriorityList: FC<PriorityListProps> = ({ classes }) => {
  const [openModal, closeModal] = useModal();
  const dispatch = useDispatch();
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const hasInitialized = useRef<boolean>(false);
  const thoughts = useTypedSelector(thoughtSelector.selectAll);
  const planId = useIdFromUrl('plan');
  const thoughtsToUse = useMemo(() => planId ? thoughts.filter(t => t.planId === planId) : thoughts, [thoughts, planId]);

  const handleMinimize = () => {
    setIsMinimized(true);
    closeModal();
  };

  const handleClose = () => {
    dispatch(toggle(false));
  };

  const openPriorityList = () => {
    setIsMinimized(false);
    openModal(
      <PriorityListModal classes={classes} onMinimize={handleMinimize} thoughts={thoughtsToUse} onClose={handleClose}/>,
      'Priorities',
      {
        afterClose: handleClose,
      }
    );
  };

  useEffect(() => {
    if (thoughtsToUse.length > 0 && hasInitialized.current === false) {
      openPriorityList();
      hasInitialized.current = true;
    }
  }, [thoughtsToUse, planId]);

  return isMinimized ? (
    <button className={classes.prioritiesButton} onClick={openPriorityList}>
      Priorities
    </button>
  ) : null;
};

export default withStyles(styles)(PriorityList);
