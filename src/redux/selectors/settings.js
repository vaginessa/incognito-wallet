import {createSelector} from 'reselect';

const settingsSelector = createSelector(
  (state) => state.settings,
  (settings) => settings,
);

export const settings = state => state?.settings?.data;

export const bannersSelector = createSelector(
  settingsSelector,
  ({ banners }) => banners
);

export const codepushVersionSelector = createSelector(
  settingsSelector,
  ({ codepushVer }) => codepushVer
);

export default {
  settings,
  bannersSelector,
  codepushVersionSelector,
};
