import React, { FC, useState, FormEvent } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import Input from '../../../General/Input';
import useApp from '../../../../hooks/useApp';
import { useLoadedDB } from '../../../../hooks/useDB';
import { plans as planActions } from '../../../../actions';

interface CreatePlanProps {
  classes: any;
  onClose: () => void;
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    margin: '30px 0',
    justifyContent: 'space-between',
  },
  submitButton: {
    flex: 0,
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: 30,
    '&:active': {
      opacity: 0.7,
    }
  },
  inputLabel: {
    flex: 1,
    '& input': {
      width: '100%',
    },
  },
});

export const CreatePlan: FC<CreatePlanProps> = ({ classes, onClose }) => {
  const [inputtedValue, setInputtedValue] = useState('');
  const db = useLoadedDB();
  const { history } = useApp();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const plan = await planActions.createPlan(db, {
      name: inputtedValue,
    });

    history.push(`/plan/${plan.id}/`);
    onClose();
  }

  return (
    <form className={classes.root}
      onSubmit={handleSubmit}
    >
      <Input
        classes={classes}
        value={inputtedValue}
        onChange={e => setInputtedValue(e.target.value)}
        autoFocus={true}
        placeholder={'Name'}
      />
      <button className={classes.submitButton}>Create</button>
    </form>
  );
};

export default withStyles(styles)(CreatePlan);


/*
const handleSubmit = useCallback(() => {
    const createPlan = async () => {
      const plan = await planActions.createPlan(db, {
        name: planName,
      });
      return plan;
    };

    const attachThoughts = async (planId: string) => {
      const updateThought = async (thoughtId: string) => {
        const thought = thoughts.find(foundThought => foundThought.id === thoughtId);
        const nextThought = Object.assign({}, thought, {
          planId,
        });

        return thoughtActions.editThought(db, nextThought);
      };

      return Promise.all(selectedThoughts.map(updateThought));
    };

    const createObjectsAndGoBack = async () => {
      if (!withThoughts) {
        focusInput.current && focusInput.current(false);
      }
      const plan = await createPlan();
      setTimeout(() => {
        onClose(planName);
        attachThoughts(plan.id);
        history.push(`/plan/${plan.id}/`);
      },400);
    };

    createObjectsAndGoBack();
  }, [selectedThoughts, planName, withThoughts, history]);
*/