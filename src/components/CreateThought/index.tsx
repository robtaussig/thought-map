import React, { FC, FormEventHandler, Fragment, memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloseModal } from '../../hooks/useModal/types';
import { useLoadedDB } from '../../hooks/useDB';
import { useStyles } from './style';
import Inputs from './Inputs';
import { createWholeThought } from '../../actions/complex';
import { useHomeUrl, useIdFromUrl } from '../../lib/util';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { thoughtSelector } from '../../reducers/thoughts';
import { planSelector } from '../../reducers/plans';
import useModal from '../../hooks/useModal';
import CreateBulkThought from './Bulk';

export interface CreatedThought {
  title: string;
  type: string;
  date: string;
  time: string;
  description: string;
  notes: string[];
  tags: string[];
  tagOptions: string[];
  staged: boolean;
}

export const DEFAULT_STATE: CreatedThought = {
  title: '',
  type: 'Task',
  date: '',
  time: '',
  description: '',
  notes: [],
  tags: [],
  tagOptions: [],
  staged: false,
};

interface CreateThoughtProps {
  typeOptions: string[];
  onClose: CloseModal;
  andStage?: boolean;
}

export const CreateThought: FC<CreateThoughtProps> = ({ typeOptions, onClose, andStage }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const thoughts = useSelector(thoughtSelector);
  const plans = useSelector(planSelector);
  const [ready, setReady] = useState<boolean>(false);
  const { db } = useLoadedDB();
  const planId = useIdFromUrl('plan');
  const [openModal, closeModal] = useModal();
  const plan = plans.find(plan => plan.id === planId);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [createdThought, setCreatedThought] = useState<CreatedThought>({
    ...DEFAULT_STATE,
    type: (plan && plan.defaultType) || DEFAULT_STATE.type,
    staged: andStage,
  });
  const thoughtTitles = thoughts.map(({ title }) => title);
  const homeUrl = useHomeUrl();

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (ready) {
      const response = await createWholeThought(
        db,
        createdThought,
        selectedPlan ?
          plans.find(({ name }) => name === selectedPlan).id :
          planId,
      );

      if (!andStage) {
        navigate(`${homeUrl}thought/${response.thought.id}`);
      }

      onClose();
    }
  };

  const handleClickBulk = (e: any) => {
    e.preventDefault();
    onClose();
    openModal(
      <CreateBulkThought
        onReopenSingle={() => {
          openModal(
            <CreateThought
              onClose={closeModal}
              andStage={andStage}
              typeOptions={typeOptions}
            />, 'Create Thought'
          );
        }}
        onClose={closeModal}
      />, 'Create Bulk Thoughts'
    );
  };

  return (
    <Fragment>
      <form className={classNames(classes.form)} onSubmit={handleSubmit}>
        <Inputs
          classes={classes}
          createdThought={createdThought}
          setCreatedThought={setCreatedThought}
          typeOptions={typeOptions}
          onReady={setReady}
          thoughtTitles={thoughtTitles}
          planId={planId}
          plans={plans}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
        />
        <button className={classes.submitButton} disabled={!ready}>
          Submit
        </button>
        <button className={classes.bulkButton} onClick={handleClickBulk}>
          Bulk
        </button>
      </form>
    </Fragment>
  );
};

export default memo(CreateThought);
