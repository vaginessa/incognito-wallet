import random from 'lodash/random';
import { getBalance } from '@src/redux/actions/token';
import { otaKeyOfDefaultAccountSelector } from '@src/redux/selectors/account';
import { getPrivacyDataByTokenID } from '@src/redux/selectors/selectedPrivacy';
import { ExHandler } from '@src/services/exception';
import convert from '@src/utils/convert';
import format from '@src/utils/format';
import BigNumber from 'bignumber.js';
import { change, focus } from 'redux-form';
import { getPDexV3Instance } from '@screens/PDexV3';
import { delay } from '@src/utils/delay';
import isEmpty from 'lodash/isEmpty';
import { batch } from 'react-redux';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_SET_SELL_TOKEN,
  ACTION_SET_BUY_TOKEN,
  ACTION_SET_FEE_TOKEN,
  ACTION_SET_FOCUS_TOKEN,
  formConfigs,
} from './Swap.constant';
import {
  defaultPairSelector,
  feeSelectedSelector,
  inputAmountSelector,
  slippagetoleranceSelector,
} from './Swap.selector';

export const actionSetSellTokenFetched = (payload) => ({
  type: ACTION_SET_SELL_TOKEN,
  payload,
});

export const actionSetBuyTokenFetched = (payload) => ({
  type: ACTION_SET_BUY_TOKEN,
  payload,
});

export const actionSetFeeToken = (payload) => ({
  type: ACTION_SET_FEE_TOKEN,
  payload,
});

export const actionSetFocusToken = (payload) => ({
  type: ACTION_SET_FOCUS_TOKEN,
  payload,
});

export const actionFetching = () => ({
  type: ACTION_FETCHING,
});

export const actionFetched = (payload) => ({
  type: ACTION_FETCHED,
  payload,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionEstimateTrade = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const inputAmount = inputAmountSelector(state);
    const input1Amount = inputAmount(formConfigs.selltoken);
    const input2Amount = inputAmount(formConfigs.buytoken);
    const feetoken = feeSelectedSelector(state);
    const slippagetolerance = slippagetoleranceSelector(state);
    if (
      isEmpty(input1Amount) ||
      isEmpty(input2Amount) ||
      isEmpty(feetoken) ||
      isEmpty(slippagetolerance)
    ) {
      return;
    }
    const {
      focus: focusedInput1,
      tokenId: tokenId1,
      originalAmount: originalAmount1,
      symbol: symbol1,
      pDecimals: pDecimals1,
    } = input1Amount;
    const {
      focus: focusedInput2,
      tokenId: tokenId2,
      originalAmount: originalAmount2,
      symbol: symbol2,
      pDecimals: pDecimals2,
    } = input2Amount;
    let selltoken,
      buytoken,
      amount,
      sellsymbol,
      buysymbol,
      inputtoken,
      inputtokenDecimals;
    if (focusedInput2 && !focusedInput1) {
      selltoken = tokenId2;
      buytoken = tokenId1;
      amount = originalAmount2;
      sellsymbol = symbol2;
      buysymbol = symbol1;
      inputtoken = formConfigs.selltoken;
      inputtokenDecimals = pDecimals1;
    } else {
      selltoken = tokenId1;
      buytoken = tokenId2;
      amount = originalAmount1;
      sellsymbol = symbol1;
      buysymbol = symbol2;
      inputtoken = formConfigs.buytoken;
      inputtokenDecimals = pDecimals2;
    }
    const payload = {
      selltoken,
      buytoken,
      feetoken,
      amount,
      slippagetolerance: Number(slippagetolerance),
    };
    const feeTokenData = getPrivacyDataByTokenID(state)(feetoken);
    await dispatch(actionFetching());
    const otaKey = otaKeyOfDefaultAccountSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ otaKey });
    await delay(2000);
    const data = {
      maxGet: random(1e3, 1e4),
      fee: random(1e2, 1e3),
      route: `${sellsymbol}->${buysymbol}`,
      sizeimpact: random(0, 0.99, true),
    };
    // await pDexV3Inst.getEstimateTrade(payload);
    const amountInput = format.toFixed(
      convert.toHumanAmount(data.maxGet, inputtokenDecimals),
      inputtokenDecimals,
    );
    const amountFee = format.toFixed(
      convert.toHumanAmount(data.fee, feeTokenData.pDecimals),
      feeTokenData.pDecimals,
    );
    console.log('amountFee', amountFee);
    dispatch(change(formConfigs.formName, inputtoken, amountInput));
    dispatch(change(formConfigs.formName, formConfigs.feetoken, amountFee));
    const maxPriceStr = `1 ${sellsymbol} / ${amountInput} ${buysymbol}`;
    await dispatch(actionFetched({ ...data, maxPriceStr }));
  } catch (error) {
    console.log('ERROR', error);
    await dispatch(actionFetchFail());
  }
};

export const actionSetSellToken = (selltoken) => async (dispatch, getState) => {
  try {
    if (!selltoken) {
      return;
    }
    const state = getState();
    const token = getPrivacyDataByTokenID(state)(selltoken);
    const { pDecimals } = token;
    const balance = await dispatch(getBalance(selltoken));
    const minimum = convert.toOriginalAmount(1, token.pDecimals);
    const bnBalance = new BigNumber(balance);
    const bnMinumum = new BigNumber(minimum);
    let sellOriginalAmount = '';
    if (bnBalance.gte(bnMinumum)) {
      sellOriginalAmount = minimum;
    } else {
      sellOriginalAmount = balance;
    }
    const sellamount = format.toFixed(
      convert.toHumanAmount(sellOriginalAmount, pDecimals),
      pDecimals,
    );
    dispatch(actionSetSellTokenFetched(selltoken));
    dispatch(change(formConfigs.formName, formConfigs.selltoken, sellamount));
    dispatch(focus(formConfigs.formName, formConfigs.selltoken));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionSetBuyToken = (buytoken) => async (dispatch, getState) => {
  try {
    dispatch(getBalance(buytoken));
    dispatch(actionSetBuyTokenFetched(buytoken));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionInitSwapForm = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const defaultPair = defaultPairSelector(state);
    if (isEmpty(defaultPair)) {
      return;
    }
    await Promise.all([
      dispatch(actionSetSellToken(defaultPair.token1IdStr)),
      dispatch(actionSetBuyToken(defaultPair.token2IdStr)),
      dispatch(actionSetFeeToken(defaultPair.token1IdStr)),
      dispatch(
        change(formConfigs.formName, formConfigs.slippagetolerance, '1'),
      ),
    ]);
    dispatch(actionEstimateTrade());
  } catch (error) {
    new ExHandler(error).showErrorToast;
  }
};
