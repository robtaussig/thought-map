import React, { FC } from 'react';
import {
  StatusUpdate
} from '../types';
import { CSSProperties } from '@material-ui/styles';
import classNames from 'classnames';
import useApp from '../../../hooks/useApp';
import { homeUrl } from '../../../lib/util';
import { format } from 'date-fns';

interface PartProps {
  classes: any;
  part: StatusUpdate;
  col: number;
  row: number;
  colCount: number;
  groupIndex?: [number, number];
  isSelected: boolean;
}

const parseDate = (timestamp: number): string => {
  return format(new Date(timestamp), 'yyyy-MM-dd');
};

const capitalize = (string: string): string => {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

const generatePartText = (part: StatusUpdate, isStart: boolean, isEnd: boolean): string => {
  if (isStart) return `[${parseDate(part.created)}] ${part.thoughtTitle}`;
  return `[${parseDate(part.created)}] - ${capitalize(part.status)}`;
};

const generatePartStyle = (part: StatusUpdate, row: number, col: number, colCount: number, isStart: boolean): CSSProperties => {
  const style: CSSProperties = {
    gridRow: `${row} / span 1`,
    margin: '0 5px',
  };

  const textToTheLeft = col > colCount / 2;
  if (textToTheLeft) {
    style.gridColumn = `1 / ${col}`;
    style.textAlign = 'right';
  } else {
    style.gridColumn = `${col + 1} / -1`;
  }

  if (!isStart) {
    style.opacity = 0.6;
  }

  return style;
};

export const Part: FC<PartProps> = ({ classes, part, col, row, colCount, groupIndex, isSelected }) => {
  const { history } = useApp();

  const style = {
    gridRow: `${row} / span 1`,
    gridColumn: `${col} / span 1`,
  };

  const isStart = groupIndex && groupIndex[0] === 0;
  const isEnd = groupIndex && groupIndex[0] === groupIndex[1];

  const partText = part ? generatePartText(part, isStart, isEnd) : null;
  const partStyle = part ? generatePartStyle(part, row, col, colCount, isStart) : {};

  const handleClickTitle = () => {
    history.push(`${homeUrl(history)}thought/${part.thoughtId}`);
  };

  return (
    <>
      <div className={classNames(classes.statusUpdate, {
        new: part && part.status === 'new',
        completed: part && part.status === 'completed',
        path: part === null,
        isStart,
        isEnd,
        isSelected,
      })} style={style} onClick={() => console.log(groupIndex)}/>
      {part && isStart ? (
        <button className={classNames(classes.partText, {
          isSelected,
        })} style={partStyle}
          onClick={handleClickTitle}
        >
          {partText}
        </button>
      ) : (
        <span className={classNames(classes.partText, {
          isSelected,
        })} style={partStyle}>
          {partText}
        </span>
      )}
    </>
  );
};

export default Part;
