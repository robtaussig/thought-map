import React, { FC, useMemo, useState, FormEvent } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import Input from '../../General/Input';
import { settings as settingsActions } from '../../../actions';
import { useLoadedDB } from '../../../hooks/useDB';
import Delete from '@material-ui/icons/Delete';
import { openConfirmation } from '../../../lib/util';
import { useSelector } from 'react-redux';
import { settingSelector } from '../../../reducers/settings';

interface CustomTypesProps {
  classes: any;
  onClose: () => void;
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  form: () => ({
    display: 'flex',
    marginBottom: 20,
    '& button': {
      fontWeight: 600,
      cursor: 'pointer',
      marginLeft: 30,
      color: theme.palette.secondary[700],
    },
  }),
  inputLabel: {
    flex: 1,
    '& input': {
      width: '100%',
    },
  },
  customType: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  customTypeText: {

  },
  deleteCustomType: () => ({
    color: theme.palette.red[500],
  }),
});

export const CustomTypes: FC<CustomTypesProps> = ({ classes, onClose }) => {
  const settings = useSelector(settingSelector);
  const [inputtedValue, setInputtedValue] = useState<string>('');
  const db = useLoadedDB();
  const customTypes = useMemo(() => {
    return Array.isArray(settings.customTypes) ? settings.customTypes : [];
  }, [settings]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputtedValue('');
    const next = customTypes.concat(inputtedValue.trim());
    settingsActions.createSetting(db, {
      field: 'customTypes',
      value: next,
    });
  };

  const deleteCustomType = (value: string) => async () => {
    const next = customTypes.filter(prev => prev !== value);
    const deleteCustomType = () => {
      settingsActions.createSetting(db, {
        field: 'customTypes',
        value: next,
      });
    };

    openConfirmation('Are you sure you want to delete this?', deleteCustomType);
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
      {customTypes.map(type => {
        return (
          <div key={type} className={classes.customType}>
            <span className={classes.customTypeText}>{type}</span>
            <button className={classes.deleteCustomType} onClick={deleteCustomType(type)}><Delete /></button>
          </div>
        );
      })}
    </div>
  );
};

export default withStyles(styles)(CustomTypes);
