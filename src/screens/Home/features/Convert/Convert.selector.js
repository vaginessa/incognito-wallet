import { createSelector } from 'reselect';

export const convertCoinsSelector = createSelector(
  (state) => state.convert,
  (convert) => convert,
);

export const convertHasUnspentCoinsSelector = createSelector(
  convertCoinsSelector,
  (convert) => convert?.hasUnspentCoins,
);
