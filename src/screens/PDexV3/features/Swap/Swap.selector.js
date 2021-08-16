import { createSelector } from 'reselect';
import { listPairsSelector } from '@screens/PDexV3/features/Trade';
import { getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector } from '@src/redux/selectors/selectedPrivacy';
import { allTokensIDsSelector } from '@src/redux/selectors/token';
import format from '@src/utils/format';
import includes from 'lodash/includes';
import floor from 'lodash/floor';
import { formValueSelector, isValid } from 'redux-form';
import convert from '@src/utils/convert';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { PRV } from '@src/constants/common';
import { sharedSelector } from '@src/redux/selectors';
import { formConfigs } from './Swap.constant';
import { getInputAmount } from './Swap.utils';

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

export const pairsTokenSelector = createSelector(
  listTokenHasPairSelector,
  (tokens) => tokens,
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

export const feetokenDataSelector = createSelector(
  (state) => state,
  swapSelector,
  feeSelectedSelector,
  getPrivacyDataByTokenIDSelector,
  (state, { data }, feetoken, getPrivacyDataByTokenID) => {
    try {
      const feeTokenData: SelectedPrivacy = getPrivacyDataByTokenID(feetoken);
      const selector = formValueSelector(formConfigs.formName);
      const fee = selector(state, formConfigs.feetoken);
      const { fee: minFeeOriginal = 0 } = data;
      const feeAmount = convert.toNumber(fee, true) || 0;
      const feeAmountText = fee;
      const origininalFeeAmount = convert.toOriginalAmount(
        feeAmount,
        feeTokenData?.pDecimals,
        false,
      );
      const minFeeAmount = convert.toHumanAmount(
        minFeeOriginal,
        feeTokenData?.pDecimals,
      );
      const minFeeAmountText = format.toFixed(
        minFeeAmount,
        feeTokenData?.pDecimals,
      );
      const minFeeAmountStr = `${minFeeAmountText} ${feeTokenData?.symbol}`;
      return {
        feetoken,
        symbol: feeTokenData?.symbol,
        pDecimals: feeTokenData?.pDecimals,

        feeAmount,
        feeAmountText,
        origininalFeeAmount,

        minFeeOriginal,
        minFeeAmount,
        minFeeAmountStr,
        minFeeAmountText,
      };
    } catch (error) {
      console.log('feetokenDataSelector-error', error);
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
  feetokenDataSelector,
  swapSelector,
  sharedSelector.isGettingBalance,
  getInputAmount,
);

export const swapInfoSelector = createSelector(
  swapSelector,
  feetokenDataSelector,
  inputAmountSelector,
  (state) => state,
  (
    { data, networkfee, swaping, initing, selecting, isFetching, isFetched },
    feeTokenData,
    getInputAmount,
    state,
  ) => {
    try {
      const sellInputAmount = getInputAmount(formConfigs.selltoken);
      const buyInputAmount = getInputAmount(formConfigs.buytoken);
      const { fee, route: routing, sizeimpact, maxPriceStr } = data;
      const minFeeAmount = format.toFixed(
        convert.toHumanAmount(fee, feeTokenData?.pDecimals),
        feeTokenData?.pDecimals,
      );
      const minFeeAmountStr = `${minFeeAmount} ${feeTokenData?.symbol}`;

      const networkfeeAmount = format.toFixed(
        convert.toHumanAmount(networkfee, PRV.pDecimals),
        PRV.pDecimals,
      );
      const networkfeeAmountStr = `${networkfeeAmount} ${PRV.symbol}`;
      const sizeimpactStr = format.toFixed(
        convert.toHumanAmount(floor(sizeimpact * 100), 0),
        0,
      );
      const editableInput =
        !swaping && !initing && !selecting && isFetched && !isFetching;
      let btnSwapText = 'Preview your order';
      const calculating = swaping || initing || selecting || isFetching;
      const disabledBtnSwap =
        calculating ||
        (!isFetched && !isFetching) ||
        !isValid(formConfigs.formName)(state);
      if (calculating) {
        btnSwapText = 'Calculating...';
      }
      const tradingFeeStr = `${feeTokenData?.feeAmountText} ${feeTokenData?.symbol}`;
      const sellInputBalanceStr = `${sellInputAmount?.balanceStr} ${sellInputAmount?.symbol}`;
      const buyInputBalanceStr = `${buyInputAmount?.balanceStr} ${buyInputAmount?.symbol}`;
      const sellInputAmountStr = `${sellInputAmount?.amountText} ${sellInputAmount?.symbol}`;
      const buyInputAmountStr = `${buyInputAmount.amountText} ${buyInputAmount?.symbol}`;
      return {
        balanceStr: `${sellInputBalanceStr} + ${buyInputBalanceStr}`,
        routing,
        minFeeAmount,
        minFeeAmountStr,
        networkfeeAmountStr,
        maxPriceStr,
        sizeimpactStr,
        editableInput,
        btnSwapText,
        disabledBtnSwap,
        tradingFeeStr,
        sellInputBalanceStr,
        buyInputBalanceStr,
        sellInputAmountStr,
        buyInputAmountStr,
      };
    } catch (error) {
      //
      console.log('swapInfoSelector-error', error);
    }
  },
);

export const slippagetoleranceSelector = createSelector(
  (state) => state,
  (state) => {
    const selector = formValueSelector(formConfigs.formName);
    const slippagetolerance = selector(state, formConfigs.slippagetolerance);
    return Number(slippagetolerance) || 1;
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
