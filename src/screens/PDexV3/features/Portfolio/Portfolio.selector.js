import { createSelector } from 'reselect';
import { getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector } from '@src/redux/selectors/selectedPrivacy';
import BigNumber from 'bignumber.js';
import {
  getExchangeRate,
  getPrincipal,
  getReward,
  getShareStr,
} from '@screens/PDexV3';
import format from '@src/utils/format';

export const portfolioSelector = createSelector(
  (state) => state.pDexV3,
  ({ portfolio }) => {
    return portfolio;
  },
);

export const listShareSelector = createSelector(
  portfolioSelector,
  getPrivacyDataByTokenIDSelector,
  (portfolio, getPrivacyDataByTokenID) => {
    const { data } = portfolio;
    return data.map((item) => {
      const {
        token1IdStr,
        token2IdStr,
        token1PoolValue,
        token2PoolValue,
        share,
        totalShare,
        token1Reward,
        token2Reward,
        apy,
        amp,
      } = item;
      const token1 = getPrivacyDataByTokenID(token1IdStr);
      const token2 = getPrivacyDataByTokenID(token2IdStr);
      const shareId = `${item?.token1IdStr}-${item?.token2IdStr}`;
      const exchangeRateStr = getExchangeRate(
        token1,
        token2,
        token1PoolValue,
        token2PoolValue,
      );
      const principalStr = getPrincipal(
        token1,
        token2,
        token1PoolValue,
        token2PoolValue,
      );
      const shareStr = getShareStr(share, totalShare);
      const rewardStr = getReward(token1, token2, token1Reward, token2Reward);
      const hookFactories = [
        {
          label: 'APY',
          value: `${apy}%`,
        },
        {
          label: 'AMP',
          value: amp,
        },
        {
          label: 'Exchange rate',
          value: exchangeRateStr,
        },
        {
          label: 'Principal',
          value: principalStr,
        },
        {
          label: 'Share',
          value: shareStr,
        },
        {
          label: 'Reward',
          value: rewardStr,
          isClaimReward: true,
          shareId,
        },
      ];
      return {
        ...item,
        shareId,
        token1,
        token2,
        exchangeRateStr,
        principalStr,
        shareStr,
        rewardStr,
        hookFactories,
      };
    });
  },
);

export const listShareIDsSelector = createSelector(
  listShareSelector,
  (listShare) => listShare.map((item) => item?.shareId),
);

export const getDataByShareIdSelector = createSelector(
  listShareSelector,
  (listShare) => (shareId) =>
    listShare.find((item) => item?.shareId === shareId),
);

export const getDataShareByPoolIdSelector = createSelector(
  listShareSelector,
  (listShare) => (poolId) =>
    listShare.find((item) => item?.poolId === poolId),
);

export const totalShareSelector = createSelector(
  listShareSelector,
  (listShare) =>
    format.amount(
      listShare
        .reduce(
          (prev, cur) => prev.plus(new BigNumber(cur?.share)),
          new BigNumber('0'),
        )
        .toString(),
      0,
    ),
);
