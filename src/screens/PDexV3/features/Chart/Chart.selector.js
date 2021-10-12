import { createSelector } from 'reselect';
import { getDataByPoolIdSelector } from '@screens/PDexV3/features/Pools';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { COLORS } from '@src/styles';
import orderBy from 'lodash/orderBy';
import { mappingOrderBook } from './Chart.utils';

export const chartSelector = createSelector(
  (state) => state.pDexV3.chart,
  (chart) => chart,
);

export const priceHistorySelector = createSelector(
  chartSelector,
  ({ priceHistory, poolid }) => {
    const { minValue, maxValue } = priceHistory;
    const yMaxDomain = maxValue * 2;
    const yMinDomain = minValue;
    return {
      ...priceHistory,
      yMinDomain,
      yMaxDomain,
      poolid,
    };
  },
);

export const poolSelectedSelector = createSelector(
  chartSelector,
  getDataByPoolIdSelector,
  ({ poolid }, getDataByPoolId) => getDataByPoolId(poolid),
);

export const orderBookSelector = createSelector(
  chartSelector,
  poolSelectedSelector,
  ({ orderBook }, pool) => {
    const token1: SelectedPrivacy = pool?.token1;
    const token2: SelectedPrivacy = pool?.token2;
    const { data } = orderBook;
    const { buy = [], sell = [] } = data;
    const _buy = orderBy(
      mappingOrderBook({ data: buy, token1, token2 }).map((o) => ({
        ...o,
        color: COLORS.green,
      })),
      'price',
      'desc',
    );
    const _sell = orderBy(
      mappingOrderBook({ data: sell, token1, token2 }).map((o) => ({
        ...o,
        color: COLORS.red,
      })),
      'price',
      'asc',
    );
    return {
      ...orderBook,
      buy: _buy,
      sell: _sell,
      poolid: pool?.poolId,
    };
  },
);

export const detailsSelector = createSelector(
  chartSelector,
  poolSelectedSelector,
  (chart, pool) => {
    const {
      ampStr,
      apyStr,
      volumeToAmountStr,
      poolSizeStr,
      exchangeRateStr,
      priceChangeToAmountStr,
      perChange24hToStr,
      perChange24hColor,
    } = pool;
    const factories = [
      {
        label: 'APY',
        value: apyStr,
      },
      {
        label: 'AMP',
        value: ampStr,
      },
      {
        label: 'Trading volume 24h',
        value: volumeToAmountStr,
      },
      {
        label: 'Pool size',
        value: poolSizeStr,
      },
      {
        label: 'Exchange rate',
        value: exchangeRateStr,
      },
      {
        label: 'Price change',
        value: `${priceChangeToAmountStr} (${perChange24hToStr})`,
        color: perChange24hColor,
      },
    ];
    return {
      factories,
    };
  },
);
