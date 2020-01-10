import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../reducers';
import {
  CustomTheme,
  customThemeSelector,
  updatePalette,
  PaletteOptions,
} from '../../../reducers/customTheme';
import { withStyles, StyleRules } from '@material-ui/styles';
import PaletteColorList from './palette-color-list';

interface CustomizeThemeProps {
  classes: any,
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(10, 1fr)',
    gridGap: '10px',
    height: '100%',
    width: 'calc(100% - 80px)',
    marginTop: 10,
    marginBottom: 120,
  },
});

export const CustomizeTheme: FC<CustomizeThemeProps> = ({ classes }) => {
  const customTheme = useSelector<RootState, CustomTheme>(customThemeSelector);
  const dispatch = useDispatch();

  const handleClickRandom = (colorType: PaletteOptions) => () => {
    const randomHex = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    dispatch(updatePalette([colorType, randomHex]));
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
            onRandomize={handleClickRandom(colorType as PaletteOptions)}
          />
        );
      })}
    </div>
  );
};

export default withStyles(styles)(CustomizeTheme);
