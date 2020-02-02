import React, { FC, Fragment } from 'react';
import { CustomInput } from '../state';
import { Doc } from '../../types';
import Edit from '@material-ui/icons/Edit';
import Check from '@material-ui/icons/Check';
import useModal from '../../../../hooks/useModal';
import classNames from 'classnames';

interface CustomProps {
  classes: any;
  onChange: (field: string, value: string) => void;
  customInput: CustomInput;
  mutualFields: string[];
  toPick: string[];
  mergedItem: Doc;
}

export const Custom: FC<CustomProps> = ({
  classes,
  onChange,
  customInput,
  mutualFields,
  toPick,
  mergedItem,
}) => {
  const [openModal, closeModal] = useModal();

  const handleClick = (field: string) => {
    const handleSubmit = (e: any) => {
      e.preventDefault();
      onChange(field, e.target[field].value);
      closeModal();
    };

    openModal(
      <form className={classes.customInputForm} onSubmit={handleSubmit}>
        <label>
          {field}
          <input name={field} type={'text'} autoFocus defaultValue={customInput[field]}/>
        </label>
        <button>Submit</button>
      </form>
    );
  };

  return (
    <>
      {toPick.map((field, idx) => {
        return (
          <Fragment
            key={`edit-${field}`}
          >
            <button              
              className={classes.editCustomField}
              onClick={() => handleClick(field)}
              style={{
                gridRow: `${idx + 1} / span 1`
              }}
            >
              {customInput[field] ? (<Check/>) : (<Edit/>)}
            </button>
            {![undefined, ''].includes(customInput[field]) && (
              <span
                style={{ gridRow: `${idx + 1} / span 1` }}
                className={classNames(classes.pickableValue, 'both', {
                  selected: true,
                })}
              >
                {mergedItem[field]}
              </span>
            )}
          </Fragment>
        )
      })}
      {mutualFields.map((field, idx) => {
        return (
          <span
            key={`mutual-item-${field}`}
            style={{ gridRow: `${toPick.length + idx + 1} / span 1` }}
            className={classNames(classes.pickableValue, 'both', {
              selected: true,
            })}
          >
            {mergedItem[field]}
          </span>
        );
      })}
    </>
  );
};

export default Custom;
