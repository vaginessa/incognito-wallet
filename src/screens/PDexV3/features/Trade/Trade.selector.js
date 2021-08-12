import { createSelector } from 'reselect';
import { allTokensIDsSelector } from '@src/redux/selectors/token';
import { getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector } from '@src/redux/selectors/selectedPrivacy';
import includes from 'lodash/includes';
import orderBy from 'lodash/orderBy';
import { PRV_ID } from '@src/constants/common';
import BigNumber from 'bignumber.js';
import convert from '@src/utils/convert';

export const tradePDexV3Selector = createSelector(
  (state) => state.pDexV3,
  ({ trade }) => trade,
);

export const tradeDataPDexV3Selector = createSelector(
  tradePDexV3Selector,
  ({ data }) =>
    data.map((pair) => {
      const { token1IdStr, token2IdStr } = pair;
      return {
        ...pair,
        pairId: `${token1IdStr}-${token2IdStr}`,
      };
    }),
);

export const listPairsSelector = createSelector(
  allTokensIDsSelector,
  getPrivacyDataByTokenIDSelector,
  tradeDataPDexV3Selector,
  (tokensIDs, getPrivacyDataByTokenID, pairs) => {
    if (!tokensIDs || !pairs) {
      return [];
    }
    let pairTokens = pairs
      .filter(
        ({ token1IdStr, token2IdStr, poolid }) =>
          tokensIDs.includes(token1IdStr) ||
          tokensIDs.includes(token2IdStr) ||
          !!poolid,
      ) // remove if it not existed list tokens
      .filter(({ poolid }) => includes(poolid, PRV_ID))
      .map((pair) => {
        const {
          token1IdStr,
          token2IdStr,
          token1PoolValue,
          token2PoolValue,
        } = pair;
        const token1 = getPrivacyDataByTokenID(token1IdStr);
        const token2 = getPrivacyDataByTokenID(token2IdStr);
        const token1PoolAmount = convert.toHumanAmount(
          token1PoolValue,
          token1.pDecimals,
        );
        const token2PoolAmount = convert.toHumanAmount(
          token2PoolValue,
          token2.pDecimals,
        );
        const totalPool = new BigNumber(token1PoolAmount).plus(
          token2PoolAmount,
        );
        const validPool = totalPool.gt(0);
        return {
          ...pair,
          token1,
          token2,
          token1PoolAmount,
          token2PoolAmount,
          totalPool: totalPool.toNumber(),
          validPool,
        };
      })
      .filter((pair) => pair.validPool);
    pairTokens = orderBy(pairTokens, ['total'], ['desc']);
    return pairTokens || [];
  },
);
