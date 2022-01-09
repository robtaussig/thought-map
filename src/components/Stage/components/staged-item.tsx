import React, { FC, useMemo } from 'react';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { thoughts as thoughtActions } from '../../../actions';
import { useLoadedDB } from '../../../hooks/useDB';
import { useNavigate } from 'react-router-dom';
import Undo from '@material-ui/icons/Undo';
import Autorenew from '@material-ui/icons/Autorenew';
import { format} from 'date-fns';
import { animated } from 'react-spring';
import classNames from 'classnames';
import { getSearchParam } from '../../../lib/util';

interface StagedItemProps {
  classes: any;
  isStaging: boolean;
  item: Thought;
  style: any;
}

export const StagedItem: FC<StagedItemProps> = ({ classes, isStaging, item, style }) => {
  const { db } = useLoadedDB();
  const navigate = useNavigate();

  const handleClickItem = () => {
    navigate(`thought/${item.id}`);
  };

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

  const from = useMemo(() => getSearchParam('from') === item.id,[item.id]);

  return (
    <animated.div className={classNames(classes.stagedItem, { from })} style={style}>
      <button className={classes.unstageButton} onClick={handleClickUnstage}><Undo/></button>
      <button className={classes.stagedItemTitle} onClick={handleClickItem}>{item.title}</button>
      <button className={classes.promoteButton} onClick={handleClickPromote} disabled={isStaging}><Autorenew/></button>
    </animated.div>
  );
};

export default StagedItem;
