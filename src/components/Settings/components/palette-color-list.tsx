import React, { FC } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { PaletteShades, PaletteOptions } from '../../../reducers/customTheme';
import classNames from 'classnames';
import Refresh from '@material-ui/icons/Refresh';
import Palette from '@material-ui/icons/Palette';

interface PaletteColorListProps {
  classes: any;
  column: number;
  colorType: PaletteOptions;
  values: PaletteShades;
  onRandomize: () => void;
}

const styles = (theme: any): StyleRules => ({
  root: {

  },
  colorType: {
    display: 'grid',
    gridTemplateRows: '[header] max-content [buttons] 1fr',
    gridTemplateColumns: '[left] 1fr [right] 1fr',
    fontWeight: 600,
    fontSize: 12,
    backgroundColor: 'white',
    boxShadow: '0px 0px 5px black',
  },
  colorTypeText: {
    gridRow: 'header',
    gridColumn: 'left / -1',
    ...theme.defaults.centered,
  },
  color: {
    boxShadow: '0px 0px 5px black',
    borderRadius: '5px',
    transform: 'scale(0.95)',
    '&.main': {
      boxShadow: `0px 0px 15px black`,
      transform: 'scale(1)',
    }
  },
  button: () => ({
    ...theme.defaults.centered,
    '&.left': {
      gridColumn: 'left',
      gridRow: 'buttons',
      color: theme.palette.secondary[500],
    },
    '&.right': {
      gridColumn: 'right',
      gridRow: 'buttons',
      color: theme.palette.primary[500],
    },
  }),
});

export const PaletteColorList: FC<PaletteColorListProps> = ({
  classes,
  column,
  colorType,
  values,
  onRandomize,
}) => {

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
          onClick={onRandomize}
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
            className={classNames(classes.color, {
              main: idx === 3,
            })}
          />
        );
      })}
    </>
  );
};

export default withStyles(styles)(PaletteColorList);
