import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../reducers';
import {
  CustomTheme,
  customThemeSelector,
  updatePalette,
  PaletteOptions,
  PaletteShades,
  toggleDarkMode,
  SHADE_OPTIONS,
} from '../../../../reducers/customTheme';
import { useCustomizeThemeStyles } from './styles';
import PaletteColorList from './palette-color-list';
import {
  adjustShade,
  randomHex,
} from './util';
import Select from '../../../General/Select';

interface CustomizeThemeProps {
  onChange: () => void;
}

export const CustomizeTheme: FC<CustomizeThemeProps> = ({ onChange }) => {
  const customTheme = useSelector<RootState, CustomTheme>(customThemeSelector);
  const dispatch = useDispatch();
  const classes = useCustomizeThemeStyles({});
  const handleChange = (colorType: PaletteOptions) =>
    (baseHex: string = randomHex()) => {
      const palette = SHADE_OPTIONS.reduce((next, [shade, increment]) => {
        next[shade] = adjustShade(baseHex, customTheme.useDarkMode ? -1 * increment : increment);
        return next;
      }, {} as PaletteShades)
      dispatch(updatePalette([colorType, palette]));
      onChange();
    };

  const handleSelectDarkMode = (event: any) => {
    dispatch(toggleDarkMode());
    onChange();
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
            onChange={handleChange(colorType as PaletteOptions)}
          />
        );
      })}
      <Select
        classes={classes}
        id={customTheme.useDarkMode ? 'dark' : 'light'}
        options={['light', 'dark']}
        value={customTheme.useDarkMode ? 'dark' : 'light'}
        onChange={handleSelectDarkMode}
      />
    </div>
  );
};

export default CustomizeTheme;
