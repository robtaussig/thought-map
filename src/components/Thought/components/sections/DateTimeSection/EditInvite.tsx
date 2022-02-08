import React, { FC, memo, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import cn from 'classnames';
import { Thought } from '../../../../../store/rxdb/schemas/thought';
import Input from '../../../../General/Input';
import { Add, Remove } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { participantSelector } from '../../../../../reducers/participants';
import { useLoadedDB } from '../../../../../hooks/useDB';
import { participants as participantsActions } from '../../../../../actions';

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputLabel: {
    display: 'flex',
    flexDirection: 'column-reverse',
    flex: 1,
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
    flexDirection: 'column'
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
  onEdit: (thought: Thought, participants: { name: string; email: string; }[]) => void;
  onClose: () => void;
}

export const EditInvite: FC<EditInviteProps> = ({
  className,
  thought,
  onEdit,
  onClose,
}) => {
  const classes = useStyles();
  const { db } = useLoadedDB();
  const allParticipants = useSelector(participantSelector.selectAll);
  const thoughtParticipants = useMemo(() =>
    allParticipants.filter(({ thoughtId }) => thoughtId === thought.id), [thought, allParticipants]);
  const [participants, setParticipants] = useState(thoughtParticipants.map(({ id, name, email }) => ({ id, name, email })).concat({ name: '', email: '', id: null }));

  const reconcileParticipants = async (newParticipants: { id: string | null; name: string; email: string }[]) => {
    const participantsToRemove = thoughtParticipants.filter(p => !newParticipants.some(({ id }) => id === p.id));
    const participantsToCreate = newParticipants.filter(p => p.id === null && !thoughtParticipants.some(({ email }) => email === p.email));
    const participantsToUpdate = newParticipants.filter(p => {
      if (p.id === null) return false;
      const np = thoughtParticipants.find(({ id }) => id === p.id);
      return np.name !== p.name || np.email !== p.email;
    }).map(p => {
      const oldP = thoughtParticipants.find(op => op.id === p.id);
      return {
        ...oldP,
        ...p
      };
    });

    return Promise.all([
      ...participantsToRemove.map(p => participantsActions.deleteParticipant(db, p.id)),
      ...participantsToCreate.map(p => participantsActions.createParticipant(db, { ...p, thoughtId: thought.id })),
      ...participantsToUpdate.map(p => participantsActions.editParticipant(db, p)),
    ]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const newParticipants = participants.filter(p => p.name && p.email);
    onEdit(thought, newParticipants);
    await reconcileParticipants(newParticipants);
    onClose();
  };

  return (
    <form className={cn(classes.root, className)} onSubmit={handleSubmit}>
      <h2 className={classes.header}>Add Event to Calendar</h2>
      <h3 className={classes.participantsHeader}>Participants</h3>
      <ul className={classes.participantList}>
        {participants.map(({ name, email }, idx) => (
          <li key={`${idx}-participant`} className={classes.participant}>
            <Input
              classes={classes}
              value={name}
              id={'name'}
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
              id={'email'}
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
              <button type={'button'} className={classes.addParticipant} onClick={() => setParticipants(prev => prev.concat({ name: '', email: '', id: null }))}><Add/></button>
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
