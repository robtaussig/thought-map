import React, { FC } from 'react';
import { CSSProperties } from '@material-ui/styles';
import { Thought } from '../../../store/rxdb/schemas/thought';
import classNames from 'classnames';
import useApp from '../../../hooks/useApp';
import useLongPress from '../../../hooks/useLongPress';
import ConnectionsQuickOptions from './ConnectionsQuickOptions';
import useModal from '../../../hooks/useModal';
import { homeUrl } from '../../../lib/util';

interface NodeComponentProps {
  classes: any;
  x: number;
  y: number;
  columns: number;
  thought: Thought;
  isOrigin: boolean;
  statusOptions: string[];
}

export const NodeComponent: FC<NodeComponentProps> = ({
  classes,
  x,
  y,
  columns,
  thought,
  isOrigin,
  statusOptions,
}) => {
  const { history } = useApp();
  const [openModal, closeModal] = useModal();
  const onLongPress = () => {
    openModal(
      <ConnectionsQuickOptions
        onClose={closeModal}
        thoughtId={thought.id}
        statusOptions={statusOptions}
      />
    );
  };

  const handleLongPress = useLongPress(onLongPress, 300);
  const nodeStyle = {
    gridRow: y + 1,
    gridColumn: x + 1,
  };

  const testShift = (((window.innerWidth / (columns + 1)) / 2) - 20) * -1;

  const titleToLeft = x > (columns / 2);
  const titleStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gridRow: y + 1,
    borderBottom: '1px solid #ffffff29',
    borderStyle: 'dotted',
  };

  if (titleToLeft) {
    titleStyle.gridColumn = `1 / ${x + 1}`;
    titleStyle.marginRight = testShift;
    titleStyle.marginLeft = 10;
  } else {
    titleStyle.gridColumn = `${x + 2} / -1`;
    titleStyle.justifyContent = 'flex-start';
    titleStyle.marginLeft = testShift;
    titleStyle.marginRight = 10;
  }

  const handleClick = () => {
    history.push(`${homeUrl(history)}thought/${thought.id}`);
  };

  return (
    <>
      <button
        className={classNames(classes.nodeComponent, {
          origin: isOrigin,
          completed: thought.status === 'completed',
          inProgress: !['completed', 'new'].includes(thought.status),
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
