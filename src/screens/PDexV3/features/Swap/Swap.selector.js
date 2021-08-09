import { createSelector } from 'reselect';

export const swapSelector = createSelector(
  (state) => state.swap,
  (swap) => swap,
);
