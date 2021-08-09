import { createSelector } from 'reselect';

export const orderLimitSelector = createSelector(
  (state) => state.orderLimit,
  (orderLimit) => orderLimit,
);
