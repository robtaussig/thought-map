import React, { FC } from 'react';
import { Thought } from '../../../store/rxdb/schemas/thought';
import classNames from 'classnames';
import useApp from '../../../hooks/useApp';
import useLongPress from '../../../hooks/useLongPress';
import ConnectionsModal from '../../Thought/components/sections/ConnectionsSection/components/ConnectionsModal';
import useModal from '../../../hooks/useModal';
import { homeUrl } from '../../../lib/util';

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
  const { history } = useApp();
  const [openModal, closeModal] = useModal();
  const onLongPress = () => {
    openModal(
      <ConnectionsModal
        onClose={closeModal}
        thoughtId={thought.id}
      />
    );
  };

  const handleLongPress = useLongPress(onLongPress);
  const nodeStyle = {
    gridRow: y + 1,
    gridColumn: x + 1,
  };

  const testShift = (((window.innerWidth / (columns + 1)) / 2) - 20) * -1;

  const titleToLeft = x > (columns / 2);
  const titleStyle = titleToLeft ? {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: testShift,
    gridRow: y + 1,
    gridColumn:  `1 / ${x + 1}`,
  } : {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: testShift,
    gridRow: y + 1,
    gridColumn: `${x + 2} / -1`,
  };

  const handleClick = () => {
    history.push(`${homeUrl(history)}thought/${thought.id}`);
  };

  return (
    <>
      <button
        className={classNames(classes.nodeComponent, {
          origin: isOrigin,
          completed: thought.status === 'completed',
        })}
        style={nodeStyle}
        aria-label={thought.title}
        onClick={handleClick}
        {...handleLongPress}
      />
      <button
        className={classNames(classes.nodeTitle, {
          origin: isOrigin,
        })}
        style={titleStyle}
        onClick={handleClick}
        {...handleLongPress}
        aria-label={thought.title}
      >
        {thought.title}
      </button>
    </>
  );
};

export default NodeComponent;
