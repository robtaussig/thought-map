import React, { FC, useState } from 'react';
import CheckBox from '../../General/CheckBox';
import { openConfirmation } from '../../../lib/util';
import { useLoadedDB } from '../../../hooks/useDB';
import { plans as planActions, thoughts as thoughtActions } from '../../../actions';
import { Plan } from 'store/rxdb/schemas/plan';
import { Thought } from 'store/rxdb/schemas/thought';

interface DeletePlanProps {
  classes: any,
  plan: Plan,
  thoughts: Thought[],
  afterDelete: () => void,
}

export const DeletePlan: FC<DeletePlanProps> = ({ classes, plan, thoughts, afterDelete }) => {
  const [withThoughts, setWithThoughts] = useState<boolean>(false);
  const db = useLoadedDB();

  const handleClickDelete = async () => {
    const message = withThoughts ?
      'Are you sure you want to delete this plan and all associated thoughts?' :
      'Are you sure you want to delete this plan?';

    const onDelete = async () => {
      const thoughtsToDelete = withThoughts ?
        thoughts.filter(({ planId }) => planId === plan.id) :
        [];
      const thoughtsToEdit = withThoughts ?
        [] :
        thoughts
          .filter(({ planId }) => planId === plan.id)
          .map(thought => {
            return Object.assign({}, thought, {
              planId: '',
            });
          });

      await Promise.all(thoughtsToDelete.map(thought => thoughtActions.deleteThought(db, thought.id)));
      await Promise.all(thoughtsToEdit.map(thought => thoughtActions.editThought(db, thought)));
      planActions.deletePlan(db, plan.id);
      afterDelete();
    };
  
    openConfirmation(message, onDelete);
  };
  
  return (
    <section className={classes.deletePlanSection}>
      <button className={classes.deletePlanButton} onClick={handleClickDelete}>
        Delete
      </button>
      <CheckBox
        id={'with-thoughts'}
        title={'Delete all thoughts associated with this plan'}
        classes={classes}
        isChecked={withThoughts}
        value={'Delete associated thoughts'}
        onChange={e => setWithThoughts(e.target.checked)}
        label={'Delete associated thoughts'}
      />
    </section>
  );
};

export default DeletePlan;
