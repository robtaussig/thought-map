import React, { FC, memo, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import cn from 'classnames';
import { Thought } from '../../../../../store/rxdb/schemas/thought';
import Input from '../../../../General/Input';
import { Add, Remove } from '@material-ui/icons';

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputLabel: {
    display: 'flex',
    flexDirection: 'column-reverse',
    '& :invalid:not(:focus)': {
      background: '#ff1f1f36',
    }
  },
  header: {
    fontWeight: 600,
    marginBottom: 10,
  },
  participantsHeader: {
    fontWeight: 600,
    margin: '10px 0',
  },
  participantList: {
    display: 'flex',
    flexDirection: 'column',
  },
  participant: {
    display: 'flex',
    position: 'relative',
    marginBottom: 8,
    '& > label': {
      flex: 1,
    }
  },
  addParticipant: {
    position: 'absolute',
    right: 0,
    transform: 'translate(100%, -50%)',
    top: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    padding: '5px 12px',
    marginLeft: 'auto',
    color: theme.palette.secondary[700],
    marginTop: 20,
    border: `1px solid ${theme.palette.secondary[700]}`,
    borderRadius: '5px',
  },
}));

export interface EditInviteProps {
  className?: string;
  thought: Thought;
  onEdit: (thought: Thought, location: string, participants: { name: string; email: string; }[]) => void;
  onClose: () => void;
}

export const EditInvite: FC<EditInviteProps> = ({
  className,
  thought,
  onEdit,
  onClose,
}) => {
  const classes = useStyles();
  // const [editedThought, setEditedThought] = useState(thought);
  const [location, setLocation] = useState('');
  const [participants, setParticipants] = useState([{ name: '', email: '' }]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    onEdit(thought, location, participants.filter(p => p.name && p.email));
    onClose();
  };

  return (
    <form className={cn(classes.root, className)} onSubmit={handleSubmit}>
      <h2 className={classes.header}>Add Event to Calendar</h2>
      <Input
        classes={classes}
        label={'Location'}
        value={location}
        onChange={e => {
          const inputValue = e.target.value;
          setLocation(inputValue);
        }}
        type={'text'}
      />
      <h3 className={classes.participantsHeader}>Participants</h3>
      <ul className={classes.participantList}>
        {participants.map(({ name, email }, idx) => (
          <li key={`${idx}-participant`} className={classes.participant}>
            <Input
              classes={classes}
              value={name}
              placeholder={'Name'}
              autoFocus={idx > 0}
              onChange={e => {
                const inputValue = e.target.value;
                setParticipants(prev => prev.map((p, pIdx) => {
                  if (pIdx === idx) return {
                    ...p,
                    name: inputValue,
                  };
                  return p;
                }));
              }}
              type={'text'}
            />
            <Input
              classes={classes}
              value={email}
              placeholder={'Email'}
              onChange={e => {
                const inputValue = e.target.value;
                setParticipants(prev => prev.map((p, pIdx) => {
                  if (pIdx === idx) return {
                    ...p,
                    email: inputValue,
                  };
                  return p;
                }));
              }}
              type={'email'}
            />
            {idx === participants.length - 1 ? (
              <button type={'button'} className={classes.addParticipant} onClick={() => setParticipants(prev => prev.concat({ name: '', email: '' }))}><Add/></button>
            ) : (
              <button type={'button'} className={classes.addParticipant} onClick={() => setParticipants(prev => {
                const next = [...prev];
                next.splice(idx, 1);
                return next;
              })}><Remove/></button>
            )}
          </li>
        ))}
      </ul>
      <button className={classes.submitButton} type={'submit'}>
        Submit
      </button>
    </form>
  );
};

export default memo(EditInvite);
