import React, { FC } from 'react';
import { useStyles } from './style';
import classNames from 'classnames';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { Plan } from '../../../store/rxdb/schemas/plan';
import { Removable } from '../types';
import Delete from '@material-ui/icons/Delete';
import CurrentReview from '../CurrentReview';

interface CurrentRemovableProps {
  rootClassName: string;
  removable: Removable;
  onPick: (pickRemove: boolean) => void;
  thoughts: Thought[];
  plans: Plan[];
}

export const CurrentRemovable: FC<CurrentRemovableProps> = ({
  rootClassName,
  removable,
  onPick,
  thoughts,
  plans,
}) => {
  const classes = useStyles({});

  const [{ collectionName }, { thoughtId, ...item }] = removable;

  return (
    <div className={classNames(classes.root, rootClassName)}>
      <CurrentReview
        item={{ collectionName, item }}
        rootClassName={classes.removable}
        thoughts={thoughts}
        plans={plans}
        items={[]}
      />
      <button
        onClick={() => onPick(false)}
        className={classes.keepButton}
      >
        Keep
      </button>
      <h2 className={classes.rightHeader}>Remove</h2>
      <button
        onClick={() => onPick(true)}
        className={classes.deleteButton}  
      >
        <Delete/>  
      </button>
    </div>
  );
};

export default CurrentRemovable;
