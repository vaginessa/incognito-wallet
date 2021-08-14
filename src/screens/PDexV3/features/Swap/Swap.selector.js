import { createSelector } from 'reselect';
import { listPairsSelector } from '@screens/PDexV3/features/Trade';
import { getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector } from '@src/redux/selectors/selectedPrivacy';
import { allTokensIDsSelector } from '@src/redux/selectors/token';
import format from '@src/utils/format';
import includes from 'lodash/includes';
import floor from 'lodash/floor';
import { formValueSelector } from 'redux-form';
import convert from '@src/utils/convert';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { PRV } from '@src/constants/common';
import { formConfigs } from './Swap.constant';

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
      const tokenId = swap[field];
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

export const feeSelectedSelector = createSelector(
  swapSelector,
  ({ feetoken }) => feetoken || '',
);

export const swapInfoSelector = createSelector(
  swapSelector,
  feeSelectedSelector,
  getPrivacyDataByTokenIDSelector,
  selltokenSelector,
  buytokenSelector,
  listPairsSelector,
  (
    { data, networkfee },
    feetoken,
    getPrivacyDataByTokenID,
    selltoken: SelectedPrivacy,
    buytoken: SelectedPrivacy,
  ) => {
    try {
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
      const feeTokenData = getPrivacyDataByTokenID(feetoken);
      const { fee, route: routing, sizeimpact, maxPriceStr } = data;
      const minFeeAmount = format.toFixed(
        convert.toHumanAmount(fee, feeTokenData.pDecimals),
        feeTokenData.pDecimals,
      );
      const minFeeAmountStr = `${minFeeAmount} ${feeTokenData.symbol}`;
      const networkfeeAmount = format.toFixed(
        convert.toHumanAmount(networkfee, PRV.pDecimals),
        PRV.pDecimals,
      );
      const networkfeeAmountStr = `${networkfeeAmount} ${PRV.symbol}`;
      const sizeimpactStr = format.toFixed(
        convert.toHumanAmount(floor(sizeimpact * 100), 0),
        0,
      );
      return {
        balanceStr: `${selltokenBalance} ${selltoken.symbol} + ${buytokenBalance} ${buytoken.symbol}`,
        routing,
        minFeeAmount,
        minFeeAmountStr,
        networkfeeAmountStr,
        maxPriceStr,
        sizeimpactStr,
      };
    } catch (error) {
      //
      console.log('swapInfoSelector-error', error);
    }
  },
);

export const focustokenSelector = createSelector(
  swapSelector,
  ({ focustoken }) => focustoken,
);

export const inputAmountSelector = createSelector(
  (state) => state,
  inpuTokenSelector,
  focustokenSelector,
  (state, getInputToken, focustoken) => (field) => {
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
      const originalAmount = convert.toOriginalAmount(amount, token.pDecimals);
      const focus = token.tokenId === focustoken;
      return {
        amount,
        originalAmount,
        focus,
        tokenId: token.tokenId,
        symbol: token.symbol,
        pDecimals: token.pDecimals,
      };
    } catch (error) {
      console.log('inputAmountSelector error', error);
    }
  },
);

export const slippagetoleranceSelector = createSelector(
  (state) => state,
  (state) => {
    const selector = formValueSelector(formConfigs.formName);
    const slippagetolerance = selector(state, formConfigs.slippagetolerance);
    return slippagetolerance || 1;
  },
);

export const feeTypesSelector = createSelector(
  selltokenSelector,
  buytokenSelector,
  feeSelectedSelector,
  (selltoken: SelectedPrivacy, buytoken: SelectedPrivacy, feetoken) =>
    selltoken?.tokenId && buytoken?.tokenId
      ? [
        {
          tokenId: selltoken.tokenId,
          symbol: selltoken.symbol,
          actived: feetoken == selltoken?.tokenId,
        },
        {
          tokenId: buytoken.tokenId,
          symbol: buytoken.symbol,
          actived: feetoken == buytoken?.tokenId,
        },
      ]
      : [],
);
