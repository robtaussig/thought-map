import React, { FC, useReducer } from 'react';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { Comparable, Item } from '../types';
import { compareReducer, generateInitialState } from './state';
import Fields from './Fields';
import Side from './Side';
import Merged from './Merged';
import ParentThought from './ParentThought';
import classNames from 'classnames';
import { useStyles } from './styles';

interface CurrentCompareProps {
  rootClassName: string;
  comparable: Comparable;
  onPick: (item: Item) => void;
  thoughts: Thought[];
}

export const CurrentCompare: FC<CurrentCompareProps> = ({ rootClassName, comparable, onPick, thoughts }) => {
  const classes = useStyles({});
  const [state, dispatch] = useReducer(compareReducer, generateInitialState(comparable));
  return (
    <div className={classNames(classes.root, rootClassName)}>
      <ParentThought classes={classes}/>
      <Fields classes={classes}/>
      <Side classes={classes} rootClassName={'left'}/>
      <Side classes={classes} rootClassName={'right'}/>
      <Merged classes={classes}/>
    </div>
  );
};

export default CurrentCompare;
