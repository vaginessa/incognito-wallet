import {createSelector} from 'reselect';
import memoize from 'memoize-one';
import {selectedPrivacySelector} from '@src/redux/selectors';
import isEmpty from 'lodash/isEmpty';
import {getExchangeRate, getPrincipal, getReward, getShareStr} from '@screens/Liquidity3/Liquidity3.utils';

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
    const { fetchingPool, refreshPool, fetchingFavorite, fetchingPortfolio } = liquidity3;
    const isFetching = fetchingPool && !refreshPool;
    const isRefreshing = refreshPool && !fetchingPool;
    const loadingFavorite = fetchingFavorite;
    return {
      isFetching,
      isRefreshing,
      loadingFavorite,
      fetchingPortfolio
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

export const portfolioItemDataSelector = createSelector(
  selectedPrivacySelector.getPrivacyDataByTokenID,
  (getPrivacyDataByTokenID) =>
    memoize((data) => {
      if (!data || !data?.token1ID || !data?.token2ID) return null;
      const { token1ID, token2ID, APY, token1PoolValue, token2PoolValue, share, totalShare, token1Reward, token2Reward } = data;
      const token1 = getPrivacyDataByTokenID(token1ID);
      const token2 = getPrivacyDataByTokenID(token2ID);
      const APYStr = `${APY}%`;
      const exchangeRateStr = getExchangeRate(token1, token2, token1PoolValue, token2PoolValue);
      const principalStr = getPrincipal(token1, token2, token1PoolValue, token2PoolValue);
      const shareStr = getShareStr(share, totalShare);
      const rewardStr = getReward(token1, token2, token1Reward, token2Reward);
      return {
        ...data,
        token1,
        token2,
        APYStr,
        exchangeRateStr,
        principalStr,
        shareStr,
        rewardStr,
      };
    }),
);

export const portfolioListSelector = createSelector(
  liquidity3Selector,
  memoize((liquidity3) => {
    const { portfolioList } = liquidity3;
    return portfolioList || [];
  })
);
