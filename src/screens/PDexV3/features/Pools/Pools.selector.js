import { createSelector } from 'reselect';
import format from '@src/utils/format';
import { getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector } from '@src/redux/selectors/selectedPrivacy';
import { COLORS } from '@src/styles';
import { getExchangeRate } from '@screens/PDexV3';
import uniqBy from 'lodash/uniqBy';

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

export const followPoolIdsSelector = createSelector(
  poolsSelector,
  ({ followIds }) => followIds || [],
);

/*** Pools with current pairID select */
export const poolPairIdsSelector = createSelector(
  poolsSelector,
  ({ listPools }) => listPools.map((pool) => pool.poolId),
);

/*** Pools with current pairID merge with followPools  select */
export const listPoolsSelector = createSelector(
  poolsSelector,
  getPrivacyDataByTokenIDSelector,
  followPoolIdsSelector,
  ({ listPools }, getPrivacyDataByTokenID, followIds) => {
    const pools = uniqBy([...listPools], 'poolId');
    return pools.map((pool) => {
      const {
        volume,
        priceChange,
        poolId,
        token1Value,
        token2Value,
        apy,
        amp,
        priceChange24H,
        token1Id,
        token2Id,
        virtual1Value,
        virtual2Value,
      } = pool;
      const volumeToAmount = format.amount(volume, 0);
      const priceChangeToAmount = format.amount(priceChange, 0);
      const perChange24h = priceChange24H;
      const perChangeSign = perChange24h > 0 ? '+' : '';
      const perChange24hToStr = `${perChangeSign}${perChange24h}%`;
      let perChange24hColor = COLORS.newGrey;
      if (perChange24h > 0) {
        perChange24hColor = COLORS.green;
      } else if (perChange24h < 0) {
        perChange24hColor = COLORS.red;
      }
      const token1 = getPrivacyDataByTokenID(token1Id);
      const token2 = getPrivacyDataByTokenID(token2Id);
      let pool1ValueStr = format.amountFull(
        token1Value,
        token1.pDecimals,
        false,
      );
      let pool2ValueStr = format.amountFull(
        token2Value,
        token2.pDecimals,
        false,
      );
      const poolSizeStr = `${pool1ValueStr} ${token1?.symbol} + ${pool2ValueStr} ${token2?.symbol}`;
      return {
        ...pool,
        token1,
        token2,
        volumeToAmount,
        priceChangeToAmount,
        perChange24hToStr,
        perChange24hColor,
        isFollowed: followIds.findIndex((_poolId) => poolId === _poolId) > -1,
        poolTitle: `${token1?.symbol} / ${token2?.symbol}`,
        poolSizeStr,
        exchangeRateStr: getExchangeRate(
          token1,
          token2,
          token1Value,
          token2Value,
        ),
        volumeToAmountStr: `${volumeToAmount}$`,
        ampStr: `${amp}`,
        apyStr: `${apy}%`,
        priceChangeToAmountStr: `$${priceChangeToAmount}`,
        virtualValue: {
          [token1Id]: virtual1Value,
          [token2Id]: virtual2Value,
        },
      };
    });
  },
);

export const getDataByPoolIdSelector = createSelector(
  listPoolsSelector,
  (listPools) => (poolId) =>
    poolId && listPools.find((pool) => pool?.poolId === poolId),
);

export const isFetchingSelector = createSelector(
  poolsSelector,
  ({ isFetching }) => isFetching,
);
