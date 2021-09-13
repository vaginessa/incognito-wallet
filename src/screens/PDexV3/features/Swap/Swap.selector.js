import { createSelector } from 'reselect';
import { getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector } from '@src/redux/selectors/selectedPrivacy';
import { allTokensIDsSelector } from '@src/redux/selectors/token';
import format from '@src/utils/format';
import includes from 'lodash/includes';
import floor from 'lodash/floor';
import { formValueSelector, isValid } from 'redux-form';
import convert from '@src/utils/convert';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { PRV, PRV_ID } from '@src/constants/common';
import { sharedSelector } from '@src/redux/selectors';
import BigNumber from 'bignumber.js';
import orderBy from 'lodash/orderBy';
import { formConfigs } from './Swap.constant';
import { getInputAmount } from './Swap.utils';


export const swapSelector = createSelector(
  (state) => state.pDexV3,
  ({ swap }) => swap,
);

export const listPairsSelector = createSelector(
  allTokensIDsSelector,
  getPrivacyDataByTokenIDSelector,
  swapSelector,
  (tokensIDs, getPrivacyDataByTokenID, { pairs }) => {
    if (!tokensIDs || !pairs) {
      return [];
    }
    let pairTokens = pairs
      .map((pair) => {
        const { token1IdStr, token2IdStr } = pair;
        return {
          ...pair,
          pairId: `${token1IdStr}-${token2IdStr}`,
        };
      })
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
      let feeAmount = convert.toNumber(fee, true) || 0;
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
  getPrivacyDataByTokenIDSelector,
  (
    {
      data,
      networkfee,
      swapingToken,
      initing,
      selecting,
      isFetching,
      isFetched,
      percent,
      swaping,
    },
    feeTokenData,
    getInputAmount,
    state,
    getPrivacyDataByTokenID,
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
        !swapingToken && !initing && !selecting && isFetched && !isFetching;
      let btnSwapText = 'Preview your order';
      const calculating = swapingToken || initing || selecting || isFetching;
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
      const buyInputAmountStr = `${buyInputAmount?.amountText} ${buyInputAmount?.symbol}`;
      const prv: SelectedPrivacy = getPrivacyDataByTokenID(PRV.id);
      const showPRVBalance =
        !sellInputAmount.isMainCrypto && !buyInputAmount.isMainCrypto;
      const prvBalance = format.amountFull(prv.amount, PRV.pDecimals, false);
      const prvBalanceStr = `${prvBalance} ${PRV.symbol}`;
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
        networkfee,
        showPRVBalance,
        prvBalanceStr,
        percent,
        swaping,
      };
    } catch (error) {
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
  feeSelectedSelector,
  (selltoken: SelectedPrivacy, feetoken) => {
    let types = [
      {
        tokenId: PRV.id,
        symbol: PRV.symbol,
        actived: feetoken == PRV.id,
      },
    ];
    if (selltoken?.tokenId && !selltoken.isMainCrypto) {
      types.push({
        tokenId: selltoken.tokenId,
        symbol: selltoken.symbol,
        actived: feetoken == selltoken.tokenId,
      });
    }
    return types;
  },
);
