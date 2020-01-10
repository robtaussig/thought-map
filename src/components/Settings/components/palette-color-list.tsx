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
    ...theme.defaults.centered,
    justifyContent: 'space-around',
    fontWeight: 600,
    fontSize: 20,
    backgroundColor: 'white',
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
  button: {
    ...theme.defaults.centered,
  },
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
        <button
          className={classes.button}
          onClick={onRandomize}
        >
          <Refresh />
        </button>
        <span>{colorType}</span>
        <button className={classes.button}>
          <Palette />
        </button>
      </div>
      {Object.entries(values).map(([shade, value], idx) => {
        return (
          <div
            key={`${colorType}-${shade}`}
            style={{
              gridRow: `${idx + 2}`,
              gridColumn: `${column + 1}`,
              backgroundColor: value,
            }}
            className={classNames(classes.color, {
              main: idx === 5,
            })}
          />
        );
      })}
    </>
  );
};

export default withStyles(styles)(PaletteColorList);
