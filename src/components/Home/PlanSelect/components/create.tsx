import React, { FC, useState, FormEvent } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import Input from '../../../General/Input';
import { useNavigate } from 'react-router-dom';
import { useLoadedDB } from '../../../../hooks/useDB';
import { plans as planActions } from '../../../../actions';

interface CreatePlanProps {
  classes: any;
  onClose: () => void;
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'grid',
    gridTemplateAreas: `"input input"
                        ". submit"`,
    gridTemplateRows: 'max-content max-content',
    gridTemplateColumns: '1fr max-content',
    gridGap: 10,
  },
  submitButton: () => ({
    gridArea: 'submit',
    color: theme.palette.secondary[700],
    cursor: 'pointer',
    fontWeight: 600,
    border: `1px solid ${theme.palette.secondary[700]}`,
    padding: '2px 5px',
    borderRadius: '4px',
    '&:disabled': {
      color: theme.palette.background[400],
      backgroundColor: 'transparent',
      border: `1px solid ${theme.palette.background[400]}`,
    },
  }),
  inputLabel: {
    gridArea: 'input',
    '& input': {
      width: '100%',
      fontSize: 20,
    },
  },
});

export const CreatePlan: FC<CreatePlanProps> = ({ classes, onClose }) => {
  const [inputtedValue, setInputtedValue] = useState('');
  const { db } = useLoadedDB();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const plan = await planActions.createPlan(db, {
      name: inputtedValue.trim(),
    });

    navigate(`/plan/${plan.id}/`);
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
      <button className={classes.submitButton} disabled={inputtedValue === ''}>Create</button>
    </form>
  );
};

export default withStyles(styles)(CreatePlan);
