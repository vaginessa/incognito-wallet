import { createSelector } from 'reselect';
import { appTheme } from '@src/theme/theme.colors';

export const themeSelector = createSelector(
  (state) => state.theme,
  (theme) => theme,
);

export const darkModeSelector = createSelector(themeSelector, (theme) => theme.darkMode);

export const colorsSelector = createSelector(darkModeSelector, (darkMode) => appTheme(darkMode));
