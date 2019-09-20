import React, { FC, useMemo, useState, FormEvent } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { AppState } from '../../../reducers';
import { useModalDynamicState } from '../../../hooks/useModal';
import Input from '../../General/Input';
import { settings as settingsActions } from '../../../actions';
import { useLoadedDB } from '../../../hooks/useDB';
import Delete from '@material-ui/icons/Delete';

interface CustomTypesProps {
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
    '& button': {
      fontWeight: 600,
      cursor: 'pointer',
      marginLeft: 30,
      color: 'white',
    },
  },
  inputLabel: {
    flex: 1,
    '& input': {
      width: '100%',
    },
  },
  customType: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customTypeText: {

  },
  deleteCustomType: {
    color: theme.palette.red[500],
  },
});

export const CustomTypes: FC<CustomTypesProps> = ({ classes, onClose }) => {
  const state: AppState = useModalDynamicState();
  const [inputtedValue, setInputtedValue] = useState<string>('');
  const db = useLoadedDB();
  const customTypes = useMemo(() => {
    return Array.isArray(state.settings.customTypes) ? state.settings.customTypes : [];
  }, [state.settings]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputtedValue('');
    const next = customTypes.concat(inputtedValue);
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
    //Need to edit thoughts with deleted type?
    deleteCustomType();
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
            <button className={classes.deleteCustomType} onClick={deleteCustomType(type)}><Delete/></button>
          </div>
        );
      })}
    </div>
  );
};

export default withStyles(styles)(CustomTypes);
