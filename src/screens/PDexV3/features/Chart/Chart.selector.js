import { createSelector } from 'reselect';
import BigNumber from 'bignumber.js';
import { getDataByPoolIdSelector } from '@screens/PDexV3/features/Pools';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { COLORS } from '@src/styles';
import orderBy from 'lodash/orderBy';
import moment from 'moment';
import format from '@src/utils/format';
import { mappingOrderBook } from './Chart.utils';

export const chartSelector = createSelector(
  (state) => state.pDexV3.chart,
  (chart) => chart,
);

export const poolSelectedSelector = createSelector(
  chartSelector,
  getDataByPoolIdSelector,
  ({ poolid }, getDataByPoolId) => getDataByPoolId(poolid),
);

export const priceHistorySelector = createSelector(
  chartSelector,
  poolSelectedSelector,
  ({ priceHistory, poolid }, pool) => {
    const { data, period } = priceHistory;
    const size = data.length;
    const space = 4;
    const xSpace = Math.ceil(size / space);
    let history = data.map(({ open, close, timestamp }, index) => {
      const x = timestamp * 1000;
      const isBeforeCurDate = moment(x).isBefore(moment(), 'date');
      const y = new BigNumber(open)
        .plus(close)
        .dividedBy(2)
        .toNumber();
      const yFormat = format.amountFull(y, 0, false);
      let xFormat = '';
      let xVisible = index % xSpace === 0;
      switch (period) {
      case '15m':
      case '1h':
      case '4h':
        xFormat = format.formatDateTime(x, 'HH:mm');
        break;
      case '1d':
        xFormat = format.formatDateTime(x, 'DD/MM/YY');
        break;
      case 'W':
        xFormat = format.formatDateTime(x, 'DD/MM/YY');
        break;
      case 'M':
        xFormat = format.formatDateTime(x, 'MM/YY');
        break;
      case 'Y':
        xFormat = format.formatDateTime(x, 'YYYY');
        break;
      default:
        xFormat = format.formatDateTime(x, '');
        break;
      }
      return {
        x,
        y,
        xFormat,
        yFormat,
        xVisible,
      };
    });
    return {
      ...priceHistory,
      poolid,
      history,
    };
  },
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
      mappingOrderBook({ data: buy, token1, token2, isBuy: true }).map((o) => ({
        ...o,
        color: COLORS.green,
      })),
      'price',
      'desc',
    );
    const _sell = orderBy(
      mappingOrderBook({ data: sell, token1, token2, isSell: true }).map(
        (o) => ({
          ...o,
          color: COLORS.red,
        }),
      ),
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
  poolSelectedSelector,
  (pool) => {
    const {
      volumeToAmountStr,
      poolSizeStr,
      exchangeRateStr,
      priceChangeToAmountStr,
      perChange24hToStr,
      perChange24hColor,
    } = pool;
    const factories = [
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
