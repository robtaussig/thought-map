import React, { FC } from 'react';
import { Thought } from '../../../store/rxdb/schemas/thought';
import classNames from 'classnames';

interface NodeComponentProps {
  classes: any;
  x: number;
  y: number;
  columns: number;
  rows: number;
  thought: Thought;
  isOrigin: boolean;
}

export const NodeComponent: FC<NodeComponentProps> = ({
  classes,
  x,
  y,
  columns,
  rows,
  thought,
  isOrigin,
}) => {

  const nodeStyle = {
    gridRow: y + 1,
    gridColumn: x + 1,
  };

  const titleStyle = x > (columns / 2) ? {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: 20,
    alignItems: 'center',
    gridRow: y + 1,
    gridColumn:  `1 / ${x + 1}`,
  } : {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 20,
    gridRow: y + 1,
    gridColumn: `${x + 2} / -1`,
  };

  return (
    <>
      <div
        className={classNames(classes.nodeComponent, {
          origin: isOrigin,
        })}
        style={nodeStyle}
      >
        
      </div>
      <span
        className={classNames(classes.nodeTitle, {
          origin: isOrigin,
        })}
        style={titleStyle}
      >
        {thought.title}
      </span>
    </>
  );
};

export default NodeComponent;
