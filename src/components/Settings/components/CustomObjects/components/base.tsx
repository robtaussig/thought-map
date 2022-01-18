import React, { FC, FormEvent, useMemo, useState } from 'react';
import Input from '../../../../General/Input';
import { customObjects as customObjectActions } from '../../../../../actions';
import { useLoadedDB } from '../../../../../hooks/useDB';
import Delete from '@material-ui/icons/Delete';
import { openConfirmation } from '../../../../../lib/util';
import { useSelector } from 'react-redux';
import { customObjectSelector } from '../../../../../reducers/customObjects';
import { CustomObject, CustomObjectType } from '../../../../../store/rxdb/schemas/customObject';
import { useBaseCustomObjectStyles } from '../styles';

interface CustomObjectsBaseProps {
  objectType: CustomObjectType;
}

export const CustomObjectsBase: FC<CustomObjectsBaseProps> = ({ objectType }) => {
  const classes = useBaseCustomObjectStyles({});
  const [inputtedValue, setInputtedValue] = useState<string>('');
  const { db } = useLoadedDB();
  const customObjects = useSelector(customObjectSelector);
  const objects = useMemo(() => {
    return customObjects.filter(({ type }) => type === objectType);
  }, [customObjects]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputted = inputtedValue.trim();
    if (objects.find(({ value }) => value === inputted)) return;
  
    if (inputted !== '') {
      customObjectActions.createCustomObject(db, {
        type: objectType,
        value: inputted,
      });
      setInputtedValue('');
    }
  };

  const deleteCustomObject = (object: CustomObject) => async () => {
    const deleteCustomObject = () => {
      customObjectActions.deleteCustomObject(db, object.id);
    };

    openConfirmation('Are you sure you want to delete this?', deleteCustomObject);
  };

  return (
    <div className={classes.root}>
      <h2 className={classes.header}>Custom {objectType}</h2>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Input
          classes={classes}
          value={inputtedValue}
          onChange={e => setInputtedValue(e.target.value)}
          autoFocus
        />
        <button className={classes.createButton}>Create</button>
      </form>
      <div className={classes.customObjects}>
        {objects.map(object => {
          return (
            <div key={object.value} className={classes.customObject}>
              <span>{object.value}</span>
              <button className={classes.deleteCustomObject} onClick={deleteCustomObject(object)}><Delete /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomObjectsBase;
