import React, { FC, useMemo, useState, FormEvent } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { openConfirmation } from '../../../lib/util';
import Input from '../../General/Input';
import { settings as settingsActions, statuses as statusActions, thoughts as thoughtActions } from '../../../actions';
import { useLoadedDB } from '../../../hooks/useDB';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { Status } from '../../../store/rxdb/schemas/status';
import Delete from '@material-ui/icons/Delete';
import { useSelector } from 'react-redux';
import { settingSelector } from '../../../reducers/settings';
import { thoughtSelector } from '../../../reducers/thoughts';

interface CustomStatusesProps {
  classes: any;
  onClose: () => void;
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    display: 'flex',
    marginBottom: 20,
    '& button': {
      fontWeight: 600,
      cursor: 'pointer',
      marginLeft: 30,
      color: theme.palette.secondary[700],
    },
  },
  inputLabel: {
    flex: 1,
    '& input': {
      width: '100%',
    },
  },
  customStatus: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customStatusText: {

  },
  deleteCustomStatus: {
    color: theme.palette.red[500],
  },
});

export const CustomStatuses: FC<CustomStatusesProps> = ({ classes, onClose }) => {
  const [inputtedValue, setInputtedValue] = useState<string>('');
  const db = useLoadedDB();
  const settings = useSelector(settingSelector);
  const thoughts = useSelector(thoughtSelector);
  const customStatuses = useMemo(() => {
    return Array.isArray(settings.customStatuses) ? settings.customStatuses : [];
  }, [settings]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputtedValue('');
    const next = customStatuses.concat(inputtedValue.trim());
    settingsActions.createSetting(db, {
      field: 'customStatuses',
      value: next,
    });
  };

  const deleteCustomStatus = (value: string) => async () => {
    const next = customStatuses.filter(prev => prev !== value);
    const deleteCustomStatus = () => {
      settingsActions.createSetting(db, {
        field: 'customStatuses',
        value: next,
      });
    };
    const allStatuses = await statusActions.getStatuses(db);
    const badStatuses = allStatuses.filter(status => status.text === value);
    if (badStatuses.length > 0) {
      const confirmAndDelete = async () => {
        const thoughtsToDecrement = [...new Set(badStatuses.map(({ thoughtId }) => thoughtId))]
          .map(thoughtId => thoughts.find(thought => thought.id === thoughtId));
        const convertThought = async (thought: Thought) => {
          return thoughtActions.editThought(db, {
            ...thought,
            status: 'new',
          });
        };
        const deleteStatus = async (status: Status) => {
          return statusActions.deleteStatus(db, status.id);
        };

        await Promise.all(thoughtsToDecrement.map(convertThought));
        await Promise.all(badStatuses.map(deleteStatus));
        deleteCustomStatus();
      };
      openConfirmation('This status is associated with one or more thoughts. Deleting it will alter the history of these thoughts and automatically set the status to \'new\'', confirmAndDelete);
    } else {
      deleteCustomStatus();
    }
  };

  return (
    <div className={classes.root}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Input
          classes={classes}
          value={inputtedValue}
          onChange={e => setInputtedValue(e.target.value)}
          autoFocus
        />
        <button>Create</button>
      </form>
      {customStatuses.map(status => {
        return (
          <div key={status} className={classes.customStatus}>
            <span className={classes.customStatusText}>{status}</span>
            <button className={classes.deleteCustomStatus} onClick={deleteCustomStatus(status)}><Delete/></button>
          </div>
        );
      })}
    </div>
  );
};

export default withStyles(styles)(CustomStatuses);
