import React from 'react';
import { useSelector } from 'react-redux';
import { darkModeSelector } from '@src/theme/theme.selector';
import {
  ThemeProvider as StyledComponentsThemeProvider,
} from 'styled-components';
import { appTheme } from '@src/theme/theme.colors';

export const ThemeProvider = ({ children }) => {
  const darkMode = useSelector(darkModeSelector);

  const themeObject = React.useMemo(() => appTheme(darkMode), [darkMode]);

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>;
};
