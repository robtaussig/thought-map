import React, { FC, useReducer, useMemo, useCallback, useEffect } from 'react';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { Plan } from '../../../store/rxdb/schemas/plan';
import { Comparable, Item } from '../types';
import { compareReducer, generateInitialState, ActionTypes, INITIAL_STATE } from './state';
import Fields from './Fields';
import Side from './Side';
import Custom from './Custom';
import ParentThought from './ParentThought';
import FieldHeaders from './FieldHeaders';
import classNames from 'classnames';
import { useStyles } from './styles';
import { generateFieldsToPick } from './util';
import { FIELDS_TO_HIDE } from './constants';

interface CurrentCompareProps {
  rootClassName: string;
  comparable: Comparable;
  onPick: (item: Item) => void;
  thoughts: Thought[];
  plans: Plan[];
}

export const CurrentCompare: FC<CurrentCompareProps> = ({ rootClassName, comparable, onPick, thoughts, plans }) => {
  const [state, dispatch] = useReducer(compareReducer, INITIAL_STATE);
  const [left, right] = comparable;
  const [mutualFields, fieldsToPick] = useMemo(() => {
    const showableFieldsFilter = (field: string) => !FIELDS_TO_HIDE.includes(field);
    const hasValueFilter = (field: string) => {
      return ![undefined, '', null].includes(left.item[field]) ||
        ![undefined, '', null].includes(right.item[field]);
    };

    const toPick = generateFieldsToPick(left.item, right.item)
      .filter(showableFieldsFilter)
      .sort();
    const allFields = Object.keys(left.item)
      .filter(showableFieldsFilter)
      .filter(field => !toPick.includes(field))
      .filter(hasValueFilter)
      .sort();

    return [allFields, toPick];
  }, [left, right]);

  const classes = useStyles({
    fieldCount: mutualFields.length + fieldsToPick.length,
  });

  const handleClickStage = () => {
    onPick(state.merged);
  };

  const isStageDisabled = () => {
    return fieldsToPick
      .some(field => [undefined, null, ''].includes(state.merged.item[field]));
  };

  const handleSelectSide = useCallback((field: string, value: string) => {
    dispatch({
      type: ActionTypes.Pick,
      payload: { field, value },
    });
  }, []);

  const handleCustomInput = useCallback((field: string, value: string) => {
    dispatch({
      type: ActionTypes.InputCustom,
      payload: { field, value },
    });
  }, []);

  const thoughtToDisplay = useMemo(() => {  
    if (left.item.thoughtId) return thoughts.find(({ id }) => id === left.item.thoughtId);
    if (left.item.from) return thoughts.find(({ id }) => id === left.item.from);
    if (left.item.to) return thoughts.find(({ id }) => id === left.item.to);
  }, [thoughts, left, right]);

  useEffect(() => {
    if (comparable) {
      dispatch({
        type: ActionTypes.SetState,
        payload: generateInitialState(comparable),
      });
    }
  }, [comparable]);

  return (
    <div className={classNames(classes.root, rootClassName)}>
      {thoughtToDisplay && <ParentThought classes={classes} thought={thoughtToDisplay}/>}
      <FieldHeaders classes={classes} type={left.collectionName}/>
      <div className={classes.mergeData}>
        <Fields classes={classes} mutualFields={mutualFields} toPick={fieldsToPick}/>
        {state.merged && (<Side
          classes={classes}
          rootClassName={'left'}
          mutualFields={mutualFields}
          customInput={state.customInput}
          toPick={fieldsToPick}
          item={left.item}
          merged={state.merged}
          onSelect={handleSelectSide}
          plans={plans}
        />)}
        {state.merged && (<Side
          classes={classes}
          rootClassName={'right'}
          mutualFields={mutualFields}
          customInput={state.customInput}
          toPick={fieldsToPick}
          item={right.item}
          merged={state.merged}
          onSelect={handleSelectSide}
          plans={plans}
        />)}
        {state.merged && (<Custom classes={classes}
          onChange={handleCustomInput}
          customInput={state.customInput}
          mutualFields={mutualFields}
          toPick={fieldsToPick}
          mergedItem={state.merged.item}
        />)}
      </div>
      {state.merged && (<button
        className={classes.stageButton}
        onClick={handleClickStage}
        disabled={isStageDisabled()}
      >
        Stage
      </button>)}
    </div>
  );
};

export default CurrentCompare;
