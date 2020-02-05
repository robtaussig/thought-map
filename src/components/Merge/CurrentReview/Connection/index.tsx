import React, { FC } from 'react';
import { Connection as ConnectionType } from '../../../../store/rxdb/schemas/connection';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { Item } from '../../types';
import classNames from 'classnames';

interface ConnectionProps {
  classes: any;
  rootClassName: string;
  thoughts: Thought[];
  connection: ConnectionType;
  items: Item[];
}

const MOCK_THOUGHT = {
  title: 'Mock Thought',
};

export const Connection: FC<ConnectionProps> = ({
  classes,
  rootClassName,
  thoughts,
  connection,
  items,
}) => {

  const fromThought = thoughts.find(({ id }) => id === connection.from) ||
    items.find(({ item }) => item.id === connection.from)?.item ||
    MOCK_THOUGHT;
  const toThought = thoughts.find(({ id }) => id === connection.to) ||
    items.find(({ item }) => item.id === connection.to)?.item ||
    MOCK_THOUGHT;

  return (
    <div className={classNames(classes.root, rootClassName, 'connection')}>
      <h2 className={classes.header}>Connection</h2>
      <div className={classNames(classes.connectionThought, 'from')}>
        <span className={'thought-title'}>Thought</span>
        {fromThought.title}
      </div>
      <div className={classNames(classes.connectionText, 'from')}>From</div>
      <div className={classes.connection}/>
      <div className={classNames(classes.connectionText, 'to')}>To</div>
      <div className={classNames(classes.connectionThought, 'to')}>
        <span className={'thought-title'}>Thought</span>
        {toThought.title}
      </div>
    </div>
  );
};

export default Connection;
