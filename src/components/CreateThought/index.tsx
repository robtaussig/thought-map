import React, { useState, FC, FormEventHandler, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloseModal } from '../../hooks/useModal/types';
import { useLoadedDB } from '../../hooks/useDB';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './style';
import Inputs from './Inputs';
import { createWholeThought } from '../../actions/complex';
import { useHomeUrl, useIdFromUrl } from '../../lib/util';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { thoughtSelector } from '../../reducers/thoughts';
import { planSelector } from '../../reducers/plans';

export interface CreatedThought {
  title: string;
  type: string;
  date: string;
  time: string;
  description: string;
  notes: string[];
  tags: string[];
  tagOptions: string[];
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
};

interface CreateThoughtProps {
  classes: any;
  typeOptions: string[];
  onClose: CloseModal;
  onCreateBulk: () => void;
}

export const CreateThought: FC<CreateThoughtProps> = ({ classes, typeOptions, onClose, onCreateBulk }) => {
    const navigate = useNavigate();
    const thoughts = useSelector(thoughtSelector);
    const plans = useSelector(planSelector);
    const [ready, setReady] = useState<boolean>(false);
    const { db } = useLoadedDB();
    const planId = useIdFromUrl('plan');
    const plan = plans.find(plan => plan.id === planId);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [createdThought, setCreatedThought] = useState<CreatedThought>({
        ...DEFAULT_STATE,
        type: (plan && plan.defaultType) || DEFAULT_STATE.type
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
            onClose();
            navigate(`${homeUrl}thought/${response.thought.id}`);
        }
    };

    const handleClickBulk = (e: any) => {
        e.preventDefault();
        onCreateBulk();
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

export default withStyles(styles)(CreateThought);
