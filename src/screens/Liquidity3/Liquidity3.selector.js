import {createSelector} from 'reselect';
import memoize from 'memoize-one';
import {selectedPrivacySelector} from '@src/redux/selectors';
import isEmpty from 'lodash/isEmpty';

export const liquidity3Selector = (state) => state.liquidity3;

export const favoritePoolSelector = createSelector(
  liquidity3Selector,
  (liquidity3) => liquidity3?.favoritePool || []
);

export const poolListSelector = createSelector(
  liquidity3Selector,
  favoritePoolSelector,
  memoize((liquidity3, favoritePool) => {
    const { searchPoolText, poolList } = liquidity3;
    let data = [];
    if (isEmpty(searchPoolText)) {
      data = favoritePool;
    } else {
      data = poolList;
    }
    return data;
  })
);

export const fetchingSelector = createSelector(
  liquidity3Selector,
  memoize((liquidity3) => {
    const { fetchingPool, refreshPool } = liquidity3;
    const isFetching = fetchingPool && !refreshPool;
    const isRefreshing = refreshPool && !fetchingPool;
    const loadingFavorite = isFetching || isRefreshing;
    return {
      isFetching,
      isRefreshing,
      loadingFavorite
    };
  })
);

export const poolItemDataSelector = createSelector(
  selectedPrivacySelector.getPrivacyDataByTokenID,
  (getPrivacyDataByTokenID) =>
    memoize((data) => {
      if (!data || !data?.token1ID || !data?.token2ID) return null;
      const { token1ID, token2ID } = data;
      const token1 = getPrivacyDataByTokenID(token1ID);
      const token2 = getPrivacyDataByTokenID(token2ID);
      return {
        ...data,
        token1,
        token2
      };
    }),
);
