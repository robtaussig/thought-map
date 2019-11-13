import React, { FC, useState, useRef } from 'react';
import CheckBox from '../../General/CheckBox';
import Input from '../../General/Input';
import { openConfirmation } from '../../../lib/util';
import { useLoadedDB } from '../../../hooks/useDB';
import { useLoadingOverlay } from '../../../hooks/useLoadingOverlay';
import { plans as planActions, thoughts as thoughtActions, connections as connectionActions } from '../../../actions';
import { Plan } from 'store/rxdb/schemas/plan';
import { Thought } from 'store/rxdb/schemas/thought';
import { Connection } from 'store/rxdb/schemas/types';

interface DeletePlanProps {
  classes: any;
  plan: Plan;
  thoughts: Thought[];
  afterDelete: () => void;
  connections: {
    [connectionId: string]: Connection;
  }
}

export const DeletePlan: FC<DeletePlanProps> = ({ classes, plan, thoughts, afterDelete, connections }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [setLoading, stopLoading] = useLoadingOverlay(rootRef);
  const [withThoughts, setWithThoughts] = useState<boolean>(false);
  const [inputtedPlanName, setInputtedPlanName] = useState<string>('');
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

      const connectionsToDelete = Object.entries(connections)
        .filter(([_, { from, to }]) => thoughtsToDelete.find(({ id }) => id === from || id === to))
        .map(([id]) => id);
      
      (window as any).blockDBSubscriptions = true;
      setLoading();
      await Promise.all(connectionsToDelete.map(connectionId => connectionActions.deleteConnection(db, connectionId)));
      await Promise.all(thoughtsToDelete.map(thought => thoughtActions.deleteThought(db, thought.id).catch(console.error)));
      await Promise.all(thoughtsToEdit.map(thought => thoughtActions.editThought(db, thought)));
      await planActions.deletePlan(db, plan.id);
      afterDelete();
      (window as any).blockDBSubscriptions = false;
    };
  
    openConfirmation(message, onDelete);
  };
  
  return (
    <section ref={rootRef} className={classes.deletePlanSection}>
      <button
        className={classes.deletePlanButton}
        onClick={handleClickDelete}
        disabled={withThoughts && inputtedPlanName !== plan.name}  
      >
        Delete
      </button>
      {withThoughts && <Input
        id={'confirm-delete-plan'}
        label={'Enter Plan name to confirm deletion of all associated thoughts'}
        classes={classes}
        value={inputtedPlanName}
        onChange={e => setInputtedPlanName(e.target.value)}
      />}
      <CheckBox
        id={'with-thoughts'}
        title={'Delete all thoughts associated with this plan'}
        classes={classes}
        isChecked={withThoughts}
        value={'Delete associated thoughts'}
        onChange={e => setWithThoughts(e.target.checked)}
        label={withThoughts ? '' : 'Delete associated thoughts'}
      />
    </section>
  );
};

export default DeletePlan;
