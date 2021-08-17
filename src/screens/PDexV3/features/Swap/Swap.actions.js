import random from 'lodash/random';
import { getBalance } from '@src/redux/actions/token';
import { otaKeyOfDefaultAccountSelector } from '@src/redux/selectors/account';
import { getPrivacyDataByTokenID } from '@src/redux/selectors/selectedPrivacy';
import { ExHandler } from '@src/services/exception';
import convert from '@src/utils/convert';
import format from '@src/utils/format';
import BigNumber from 'bignumber.js';
import { change, focus } from 'redux-form';
import { delay } from '@src/utils/delay';
import isEmpty from 'lodash/isEmpty';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { batch } from 'react-redux';
import { decimalDigitsSelector } from '@src/screens/Setting';
import { PRV } from '@src/constants/common';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_SET_SELL_TOKEN,
  ACTION_SET_BUY_TOKEN,
  ACTION_SET_FEE_TOKEN,
  ACTION_SET_FOCUS_TOKEN,
  formConfigs,
  ACTION_SET_SELECTING_TOKEN,
  ACTION_SET_SWAPING_TOKEN,
  ACTION_SET_INITIING_SWAP,
} from './Swap.constant';
import {
  buytokenSelector,
  defaultPairSelector,
  feeSelectedSelector,
  feetokenDataSelector,
  inputAmountSelector,
  selltokenSelector,
  slippagetoleranceSelector,
  swapSelector,
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
    if (isEmpty(input1Amount) || isEmpty(input2Amount) || isEmpty(feetoken)) {
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
    if (!selltoken || !buytoken || !amount) {
      return;
    }
    // const payload = {
    //   selltoken,
    //   buytoken,
    //   feetoken,
    //   amount,
    //   slippagetolerance: Number(slippagetolerance),
    // };
    const feeTokenData = getPrivacyDataByTokenID(state)(feetoken);
    const decimalDigits = decimalDigitsSelector(state);
    await dispatch(actionFetching());
    const otaKey = otaKeyOfDefaultAccountSelector(state);
    // const pDexV3Inst = await getPDexV3Instance({ otaKey });
    await delay(2000);
    const data = {
      maxGet: random(1e2, 1e9),
      fee: random(1e2, 1e6),
      // fee: 12e9,
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
    dispatch(change(formConfigs.formName, inputtoken, amountInput));
    dispatch(change(formConfigs.formName, formConfigs.feetoken, amountFee));
    const maxPriceStr = `1 ${sellsymbol} / ${amountInput} ${buysymbol}`;
    await dispatch(actionFetched({ ...data, maxPriceStr }));
  } catch (error) {
    console.log('ERROR', error);
    await dispatch(actionFetchFail());
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionSetFocusToken(''));
  }
};

export const actionSetSellToken = (selltoken) => async (dispatch, getState) => {
  try {
    if (!selltoken) {
      return;
    }
    dispatch(actionSetSellTokenFetched(selltoken));
    const state = getState();
    const { initing } = swapSelector(state);
    const token = getPrivacyDataByTokenID(state)(selltoken);
    const { pDecimals, symbol } = token;
    const balance = await dispatch(getBalance(selltoken));
    if (!balance) {
      return;
    }
    const minimum = convert.toOriginalAmount(1, pDecimals);
    const bnBalance = new BigNumber(balance);
    const bnMinumum = new BigNumber(minimum);
    let sellOriginalAmount = '';
    if (bnBalance.gte(bnMinumum)) {
      sellOriginalAmount = minimum;
    } else {
      sellOriginalAmount = balance;
    }
    let sellamount = '';
    if (initing) {
      const buytoken: SelectedPrivacy = buytokenSelector(state);
      const feeTokenData = feetokenDataSelector(state);
      // const slippagetolerance = slippagetoleranceSelector(state);
      // const payload = {
      //   selltoken,
      //   buytoken,
      //   feetoken,
      //   amount: sellOriginalAmount,
      //   slippagetolerance,
      // };
      // const otaKey = otaKeyOfDefaultAccountSelector(state);
      // const pDexV3Inst = await getPDexV3Instance({ otaKey });
      // await pDexV3Inst.getEstimateTrade(payload);
      await delay(2000);
      const data = {
        maxGet: 2e9,
        fee: random(1e2, 1e6),
        route: `${symbol}->${buytoken?.symbol}`,
        sizeimpact: random(0, 0.99, true),
      };
      sellamount = format.toFixed(
        convert.toHumanAmount(sellOriginalAmount, token.pDecimals),
        token.pDecimals,
      );
      const buyInputAmount = format.toFixed(
        convert.toHumanAmount(data.maxGet, buytoken.pDecimals),
        buytoken.pDecimals,
      );
      const amountFee = format.toFixed(
        convert.toHumanAmount(data.fee, feeTokenData.pDecimals),
        feeTokenData.pDecimals,
      );
      dispatch(
        change(formConfigs.formName, formConfigs.buytoken, buyInputAmount),
      );
      dispatch(change(formConfigs.formName, formConfigs.feetoken, amountFee));
      dispatch(change(formConfigs.formName, formConfigs.selltoken, sellamount));
      dispatch(focus(formConfigs.formName, formConfigs.selltoken));
      const maxPriceStr = `1 ${symbol} / ${buyInputAmount} ${buytoken.symbol}`;
      await dispatch(actionFetched({ ...data, maxPriceStr }));
    } else {
      sellamount = format.toFixed(
        convert.toHumanAmount(sellOriginalAmount, token.pDecimals),
        token.pDecimals,
      );
      dispatch(change(formConfigs.formName, formConfigs.selltoken, sellamount));
      dispatch(focus(formConfigs.formName, formConfigs.selltoken));
    }
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionSetBuyToken = (buytoken) => async (dispatch, getState) => {
  try {
    dispatch(actionSetBuyTokenFetched(buytoken));
    await dispatch(getBalance(buytoken));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionInitingSwapForm = (payload) => ({
  type: ACTION_SET_INITIING_SWAP,
  payload,
});

export const actionSetInputToken = ({ selltoken, buytoken }) => async (
  dispatch,
  getState,
) => {
  if (!selltoken || !buytoken) {
    return;
  }
  try {
    let task = [
      dispatch(actionSetSellToken(selltoken)),
      dispatch(actionSetBuyToken(buytoken)),
    ];
    if (selltoken !== PRV.id && buytoken !== PRV.id) {
      task.push(dispatch(getBalance(PRV.id)));
    }
    await Promise.all(task);
  } catch (error) {
    throw error;
  }
};

export const actionInitSwapForm = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const defaultPair = defaultPairSelector(state);
    if (isEmpty(defaultPair)) {
      return;
    }
    await dispatch(actionInitingSwapForm(true));
    const { token1IdStr: selltoken, token2IdStr: buytoken } = defaultPair;
    batch(() => {
      dispatch(actionSetSellTokenFetched(selltoken));
      dispatch(actionSetBuyTokenFetched(buytoken));
      dispatch(
        change(formConfigs.formName, formConfigs.slippagetolerance, '1'),
      );
      dispatch(actionSetFeeToken(PRV.id));
    });
    await dispatch(actionSetInputToken({ selltoken, buytoken }));
  } catch (error) {
    new ExHandler(error).showErrorToast;
  } finally {
    await dispatch(actionInitingSwapForm(false));
  }
};

export const actionSetSwapingToken = (payload) => ({
  type: ACTION_SET_SWAPING_TOKEN,
  payload,
});

export const actionSwapToken = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const selltoken: SelectedPrivacy = selltokenSelector(state);
    const buytoken: SelectedPrivacy = buytokenSelector(state);
    if (!buytoken.tokenId || !selltoken.tokenId) {
      return;
    }
    await dispatch(actionSetSwapingToken(true));
    let _selltoken = buytoken;
    let _buytoken = selltoken;
    batch(() => {
      dispatch(actionSetFocusToken(''));
      dispatch(change(formConfigs.formName, formConfigs.selltoken, ''));
      dispatch(change(formConfigs.formName, formConfigs.buytoken, ''));
      dispatch(change(formConfigs.formName, formConfigs.feetoken, ''));
      dispatch(change(formConfigs.formName, formConfigs.buytoken, ''));
      dispatch(actionSetSellTokenFetched(_selltoken.tokenId));
      dispatch(actionSetBuyTokenFetched(_buytoken.tokenId));
      dispatch(actionSetFeeToken(PRV.id));
    });
    await dispatch(
      actionSetInputToken({
        selltoken: _selltoken.tokenId,
        buytoken: _buytoken.tokenId,
      }),
    );
    await dispatch(actionEstimateTrade());
  } catch (error) {
    console.log('actionSwapToken-error', error);
    new ExHandler(error).showErrorToast;
  } finally {
    await dispatch(actionSetSwapingToken(false));
  }
};

export const actionSetSelectingToken = (payload) => ({
  type: ACTION_SET_SELECTING_TOKEN,
  payload,
});

export const actionSelectToken = (token: SelectedPrivacy, field) => async (
  dispatch,
  getState,
) => {
  if (!token.tokenId || !field) {
    return;
  }
  try {
    await dispatch(actionSetSelectingToken(true));
    const state = getState();
    const selltoken: SelectedPrivacy = selltokenSelector(state);
    const buytoken: SelectedPrivacy = buytokenSelector(state);
    switch (field) {
    case formConfigs.selltoken: {
      if (selltoken.tokenId === token.tokenId) {
        return;
      }
      if (buytoken.tokenId === token.tokenId) {
        await dispatch(actionSwapToken());
      } else {
        batch(() => {
          dispatch(change(formConfigs.formName, formConfigs.selltoken, ''));
          dispatch(change(formConfigs.formName, formConfigs.buytoken, ''));
          dispatch(change(formConfigs.formName, formConfigs.feetoken, ''));
          dispatch(actionSetSellTokenFetched(token.tokenId));
          dispatch(actionSetFocusToken(''));
          dispatch(actionSetFeeToken(PRV.id));
        });
        await dispatch(
          actionSetInputToken({
            selltoken: token.tokenId,
            buytoken: buytoken.tokenId,
          }),
        );
        await dispatch(actionEstimateTrade());
      }
      break;
    }
    case formConfigs.buytoken: {
      if (buytoken.tokenId === token.tokenId) {
        return;
      }
      if (selltoken.tokenId === token.tokenId) {
        await dispatch(actionSwapToken());
      } else {
        batch(() => {
          dispatch(change(formConfigs.formName, formConfigs.feetoken, ''));
          dispatch(change(formConfigs.formName, formConfigs.buytoken, ''));
          dispatch(actionSetBuyTokenFetched(token.tokenId));
          dispatch(actionSetBuyToken(token.tokenId));
          dispatch(actionSetFocusToken(''));
          dispatch(actionSetFeeToken(PRV.id));
        });
        await dispatch(
          actionSetInputToken({
            selltoken: selltoken.tokenId,
            buytoken: token.tokenId,
          }),
        );
        await dispatch(actionEstimateTrade());
      }
      break;
    }
    default:
      break;
    }
  } catch (error) {
    console.log('actionSetSelectingToken-error', error);
    new ExHandler(error).showErrorToast;
  } finally {
    await dispatch(actionSetSelectingToken(false));
  }
};
