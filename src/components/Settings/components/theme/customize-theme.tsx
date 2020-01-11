import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../reducers';
import {
  CustomTheme,
  customThemeSelector,
  updatePalette,
  PaletteOptions,
  PaletteShades,
} from '../../../../reducers/customTheme';
import { useCustomizeThemeStyles } from './styles';
import PaletteColorList from './palette-color-list';
import {
  adjustShade,
  randomHex,
} from './util';
import { SHADE_OPTIONS } from './constants';

interface CustomizeThemeProps {

}

export const CustomizeTheme: FC<CustomizeThemeProps> = () => {
  const customTheme = useSelector<RootState, CustomTheme>(customThemeSelector);
  const dispatch = useDispatch();
  const classes = useCustomizeThemeStyles({});
  const handleClickRandom = (colorType: PaletteOptions) =>
    (baseHex: string = randomHex()) => {
      const palette = SHADE_OPTIONS.reduce((next, [shade, increment]) => {
        next[shade] = adjustShade(baseHex, increment);
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

export default CustomizeTheme;
