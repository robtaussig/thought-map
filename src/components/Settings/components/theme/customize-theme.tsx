import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../reducers';
import {
  CustomTheme,
  customThemeSelector,
  updatePalette,
  PaletteOptions,
  PaletteShades,
  Shades,
} from '../../../../reducers/customTheme';
import { withStyles, StyleRules } from '@material-ui/styles';
import PaletteColorList from './palette-color-list';

interface CustomizeThemeProps {
  classes: any,
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(8, 1fr)',
    gridGap: '10px',
    height: '100%',
    width: 'calc(100% - 80px)',
    marginTop: 10,
  },
});

const adjust = (color: string, amount: number) => {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

const randomHex = (): string => '#' + (Math.random() * 0xFFFFFF << 0).toString(16);

const shadeOptions: [Shades, number][] = [
  [0, 250],
  [100, 200],
  [200, 150],
  [300, 100],
  [400, 50],
  [500, 0],
  [600, -50],
  [700, -100],
  [800, -150],
  [900, -200],
  ['A400', 0],
];

export const CustomizeTheme: FC<CustomizeThemeProps> = ({ classes }) => {
  const customTheme = useSelector<RootState, CustomTheme>(customThemeSelector);
  const dispatch = useDispatch();

  const handleClickRandom = (colorType: PaletteOptions) =>
    (baseHex: string = randomHex()) => {
      const palette = shadeOptions.reduce((next, [shade, increment]) => {
        next[shade] = adjust(baseHex, increment);
        return next;
      }, {} as PaletteShades)
      dispatch(updatePalette([colorType, palette]));
    };

  return (
    <div className={classes.root}>
      {Object.entries(customTheme.palette).map(([colorType, values], idx) => {
        return (
          <PaletteColorList
            key={`palette-color-list-${idx}`}
            column={idx}
            colorType={colorType as PaletteOptions}
            values={values}
            onChange={handleClickRandom(colorType as PaletteOptions)}
          />
        );
      })}
    </div>
  );
};

export default withStyles(styles)(CustomizeTheme);
