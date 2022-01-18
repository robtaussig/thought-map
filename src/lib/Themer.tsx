import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { theme } from '../App/style';
import { RootState } from '../reducers';
import { CustomTheme } from '../reducers/customTheme';
import { ThemeProvider } from '@material-ui/styles';
import merge from 'lodash/merge';

interface ThemerProps {
  children: any;
}

export const Themer: FC<ThemerProps> = ({ children }) => {
  const customTheme = useSelector<RootState, CustomTheme>(state => state.customTheme);
  const merged = useMemo(() => merge(theme, customTheme), [customTheme]);

  return (
    <ThemeProvider theme={merged}>
      {children}
    </ThemeProvider>
  );
};

export default Themer;
