import { createSelector } from 'reselect';
import format from '@src/utils/format';
import { getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector } from '@src/redux/selectors/selectedPrivacy';
import { COLORS } from '@src/styles';

export const poolsSelector = createSelector(
  (state) => state.pDexV3,
  ({ pools }) => pools,
);

export const tradingVolume24hSelector = createSelector(
  poolsSelector,
  ({ tradingVolume24h }) => format.amount(tradingVolume24h, 0, true, true),
);

export const listPoolsIDsSelector = createSelector(
  poolsSelector,
  ({ listPools }) => listPools.map((pool) => pool.poolId),
);

export const listPoolsFollowingSelector = createSelector(
  poolsSelector,
  ({ listPoolsFollowing }) => listPoolsFollowing,
);

export const listPoolsSelector = createSelector(
  poolsSelector,
  listPoolsFollowingSelector,
  getPrivacyDataByTokenIDSelector,
  ({ listPools }, listPoolsFollowing, getPrivacyDataByTokenID) =>
    listPools.map((pool) => {
      const { volume, priceChange, poolId } = pool;
      const volumeToAmount = format.amount(volume, 0);
      const priceChangeToAmount = format.amount(priceChange, 0);
      const perChange24h = pool['24H'];
      const perChangeSign = perChange24h > 0 ? '+' : '';
      const perChange24hToStr = `${perChangeSign}${perChange24h}%`;
      let perChange24hColor = COLORS.newGrey;
      if (perChange24h > 0) {
        perChange24hColor = COLORS.red;
      } else if (perChange24h < 0) {
        perChange24hColor = COLORS.green;
      }
      const token1 = getPrivacyDataByTokenID(pool.token1Id);
      const token2 = getPrivacyDataByTokenID(pool.token2Id);
      return {
        ...pool,
        token1,
        token2,
        volumeToAmount,
        priceChangeToAmount,
        perChange24hToStr,
        perChange24hColor,
        isFollowed:
          listPoolsFollowing.findIndex((_poolId) => poolId === _poolId) > -1,
        poolTitle: `${token1?.symbol} / ${token2?.symbol}`,
      };
    }),
);

export const getDataByPoolIdSelector = createSelector(
  listPoolsSelector,
  (listPools) => (poolId) =>
    poolId && listPools.find((pool) => pool?.poolId === poolId),
);
