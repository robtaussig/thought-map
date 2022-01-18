import React, { useEffect, useRef, useState, FC } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import useModal from '../../../hooks/useModal';
import PriorityListModal from './components/PriorityListModal';
import { Thought } from 'store/rxdb/schemas/thought';
import { thoughtSelector } from '../../../reducers/thoughts';
import { useSelector } from 'react-redux';

interface PriorityListProps {
  classes: any;
  thoughts?: Thought[];
  onClose?: () => void;
}
export const PriorityList: FC<PriorityListProps> = ({ classes, onClose, thoughts }) => {
    const [openModal, closeModal] = useModal();
    const [isMinimized, setIsMinimized] = useState<boolean>(false);
    const hasInitialized = useRef<boolean>(false);
    const stateThoughts = useSelector(thoughtSelector);
    const thoughtsToUse = thoughts || stateThoughts;

    const handleMinimize = () => {
        setIsMinimized(true);
        closeModal();
    };

    const openPriorityList = () => {
        setIsMinimized(false);
        openModal(
            <PriorityListModal classes={classes} onMinimize={handleMinimize} thoughts={thoughtsToUse} onClose={onClose}/>,
            'Priorities',
            {
                afterClose: onClose,
            }
        );
    };

    useEffect(() => {
        if (thoughtsToUse.length > 0 && hasInitialized.current === false) {
            openPriorityList();
            hasInitialized.current = true;
        }
    }, [thoughtsToUse]);

    return isMinimized ? (
        <button className={classes.prioritiesButton} onClick={openPriorityList}>
      Priorities
        </button>
    ) : null;
};

export default withStyles(styles)(PriorityList);
