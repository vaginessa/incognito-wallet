import { createSelector } from 'reselect';
import { listPairsSelector } from '@screens/PDexV3/features/Trade';
import { getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector } from '@src/redux/selectors/selectedPrivacy';
import { allTokensIDsSelector } from '@src/redux/selectors/token';
import format from '@src/utils/format';
import includes from 'lodash/includes';
import { formValueSelector, focus, formValues } from 'redux-form';
import convert from '@src/utils/convert';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { formConfigs } from './Swap.constant';
import { getPairRate } from '../../PDexV3.utils';

export const swapSelector = createSelector(
  (state) => state.pDexV3,
  ({ swap }) => swap,
);

export const listTokenHasPairSelector = createSelector(
  allTokensIDsSelector,
  listPairsSelector,
  getPrivacyDataByTokenIDSelector,
  (tokenIDs, pairs, getPrivacyDataByTokenID) =>
    tokenIDs
      .filter((tokenId) =>
        pairs.find(({ poolid }) => includes(poolid, tokenId)),
      )
      .map((tokenId) => getPrivacyDataByTokenID(tokenId)),
);

export const sellTokenPairsSwapSelector = createSelector(
  swapSelector,
  listTokenHasPairSelector,
  ({ buytoken, selltoken }, tokens) => {
    return tokens.filter((token) => token?.tokenId !== selltoken) || [];
  },
);

export const buyTokenPairsSwapSelector = createSelector(
  swapSelector,
  listTokenHasPairSelector,
  ({ buytoken, selltoken }, tokens) => {
    return tokens.filter((token) => token?.tokenId !== buytoken) || [];
  },
);

export const defaultPairSelector = createSelector(
  listPairsSelector,
  (pairs) => pairs[0] || null,
);

export const inpuTokenSelector = createSelector(
  getPrivacyDataByTokenIDSelector,
  swapSelector,
  (getPrivacyDataByTokenID, swap) => (field) => {
    try {
      console.log('inpuTokenSelector-field', field);
      const tokenId = swap[field];
      console.log('inpuTokenSelector-tokenId', tokenId);
      if (!tokenId) {
        return {};
      }
      const token = getPrivacyDataByTokenID(swap[field]);
      return token;
    } catch (error) {
      console.log('inpuTokenSelector-error', error);
    }
  },
);

export const selltokenSelector = createSelector(
  inpuTokenSelector,
  (getInputToken) => getInputToken(formConfigs.selltoken),
);

export const buytokenSelector = createSelector(
  inpuTokenSelector,
  (getInputToken) => getInputToken(formConfigs.buytoken),
);

export const swapInfoSelector = createSelector(
  selltokenSelector,
  buytokenSelector,
  listPairsSelector,
  (selltoken, buytoken, pairs) => {
    const selltokenId = selltoken.tokenId;
    const buytokenId = buytoken.tokenId;
    const pair =
      pairs.find(({ poolid }) => {
        return poolid.includes(selltokenId) && poolid.includes(buytokenId);
      }) || {};
    const { token1IdStr, token1PoolValue, token2PoolValue } = pair;
    let rate = getPairRate({
      token1: selltoken,
      token2: buytoken,
      token1Value:
        selltoken === token1IdStr ? token1PoolValue : token2PoolValue,
      token2Value: buytoken === token1IdStr ? token1PoolValue : token2PoolValue,
    });
    const selltokenBalance = format.amount(
      selltoken.amount,
      selltoken.pDecimals,
      false,
    );
    const buytokenBalance = format.amount(
      buytoken.amount,
      buytoken.pDecimals,
      false,
    );
    return {
      balanceStr: `${selltokenBalance} ${selltoken.symbol} + ${buytokenBalance} ${buytoken.symbol}`,
      routing: '',
      rate,
    };
  },
);

export const inputAmountSelector = createSelector(
  (state) => state,
  inpuTokenSelector,
  (state, getInputToken) => (field) => {
    try {
      const token: SelectedPrivacy = getInputToken(field);
      if (!token.tokenId) {
        return {
          amount: '',
          originalAmount: 0,
          isFocus: false,
        };
      }
      const selector = formValueSelector(formConfigs.formName);
      const amount = selector(state, field);
      console.log('amount', amount);
      const originalAmount = convert.toOriginalAmount(amount, token.pDecimals);
      console.log('originalAmount', originalAmount);
      const isFocus = focus(formConfigs.formName, field);
      return {
        amount,
        originalAmount,
        isFocus,
      };
    } catch (error) {
      console.log('inputAmountSelector error', error);
    }
  },
);

export const feeSelectedSelector = createSelector(
  swapSelector,
  ({ feetoken }) => feetoken,
);

export const feeTypesSelector = createSelector(
  selltokenSelector,
  buytokenSelector,
  (selltoken, buytoken) =>
    selltoken?.tokenId && buytoken?.tokenId
      ? [
        {
          tokenId: selltoken.tokenId,
          symbol: selltoken.symbol,
        },
        {
          tokenId: buytoken.tokenId,
          symbol: buytoken.symbol,
        },
      ]
      : [],
);
