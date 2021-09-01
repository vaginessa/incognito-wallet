import {createSelector} from 'reselect';

export const templateSelector = createSelector(
  state => state.chart,
  chart => chart,
);
