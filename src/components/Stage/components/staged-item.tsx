import React, { FC } from 'react';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { thoughts as thoughtActions } from '../../../actions';
import { useLoadedDB } from '../../../hooks/useDB';
import Undo from '@material-ui/icons/Undo';
import Autorenew from '@material-ui/icons/Autorenew';
import { format} from 'date-fns';

interface StagedItemProps {
  classes: any;
  isStaging: boolean;
  item: Thought;
}

export const StagedItem: FC<StagedItemProps> = ({ classes, isStaging, item }) => {
  const db = useLoadedDB();
  const handleClickUnstage = () => {
    thoughtActions.editThought(db, {
      ...item,
      stagedOn: '',
    });
  };

  const handleClickPromote = () => {
    thoughtActions.editThought(db, {
      ...item,
      stagedOn: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  return (
    <div className={classes.stagedItem}>
      <span className={classes.stagedItemTitle}>{item.title}</span>
      <button className={classes.unstageButton} onClick={handleClickUnstage}><Undo/></button>
      <button className={classes.promoteButton} onClick={handleClickPromote} disabled={isStaging}><Autorenew/></button>
    </div>
  );
};

export default StagedItem;
