import React, { FC } from 'react';
import { PaletteShades, PaletteOptions } from '../../../../reducers/customTheme';
import classNames from 'classnames';
import Refresh from '@material-ui/icons/Refresh';
import Palette from '@material-ui/icons/Palette';
import { usePaletteColorListStyles } from './styles';

interface PaletteColorListProps {
  column: number;
  colorType: PaletteOptions;
  values: PaletteShades;
  onChange: (shade?: string) => void;
}

export const PaletteColorList: FC<PaletteColorListProps> = ({
  column,
  colorType,
  values,
  onChange,
}) => {
  const classes = usePaletteColorListStyles({});

  return (
    <>
      <div
        className={classes.colorType}
        style={{
          gridRow: '1',
          gridColumn: `${column + 1}`,
          color: values[500],
        }}
      >
        <span className={classes.colorTypeText}>{colorType}</span>
        <button
          className={classNames(classes.button, {
            left: true,
          })}
          onClick={() => onChange()}
        >
          <Refresh />
        </button>
        <button className={classNames(classes.button, {
          right: true,
        })}>
          <Palette />
        </button>
      </div>
      {Object.entries(values).slice(2, Object.keys(values).length - 2).map(([shade, value], idx) => {
        return (
          <div
            key={`${colorType}-${shade}`}
            style={{
              gridRow: `${idx + 2}`,
              gridColumn: `${column + 1}`,
              backgroundColor: value,
            }}
            onClick={() => onChange(value)}
            className={classNames(classes.color, {
              main: idx === 3,
            })}
          />
        );
      })}
    </>
  );
};

export default PaletteColorList;
