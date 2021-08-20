import { activedTabSelector } from '@src/components/core/Tabs/Tabs.selector';
import { PRV } from '@src/constants/common';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { getBalance } from '@src/redux/actions/token';
import { otaKeyOfDefaultAccountSelector } from '@src/redux/selectors/account';
import { getPrivacyDataByTokenID } from '@src/redux/selectors/selectedPrivacy';
import { ExHandler } from '@src/services/exception';
import convert from '@src/utils/convert';
import { delay } from '@src/utils/delay';
import format from '@src/utils/format';
import BigNumber from 'bignumber.js';
import isEmpty from 'lodash/isEmpty';
import random from 'lodash/random';
import { batch } from 'react-redux';
import { change, focus } from 'redux-form';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_SET_POOL_ID,
  ACTION_SET_INITIING,
  ACTION_SET_FEE_TOKEN,
  ACTION_SET_SELL_TOKEN,
  ACTION_SET_BUY_TOKEN,
  ACTION_RESET,
  ROOT_TAB_ORDER_LIMIT,
  TAB_BUY_ID,
  TAB_SELL_ID,
  formConfigs,
  ACTION_SET_PERCENT,
} from './OrderLimit.constant';
import {
  buytokenSelector,
  feetokenDataSelector,
  inputAmountSelector,
  orderLimitSelector,
  poolSelectedDataSelector,
  rateDataSelector,
} from './OrderLimit.selector';

export const actionSetPercent = (payload) => ({
  type: ACTION_SET_PERCENT,
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

// export const actionFetch = () => async (dispatch, getState) => {
//   try {
//     await dispatch(actionFetching());
//     const { data } = await api();
//     await dispatch(actionFetched(data));
//   } catch (error) {
//     await dispatch(actionFetchFail());
//   }
// };

export const actionReset = (payload) => ({
  type: ACTION_RESET,
  payload,
});

export const actionSetFeeToken = (payload) => ({
  type: ACTION_SET_FEE_TOKEN,
  payload,
});

export const actionSetPoolSelected = (payload) => ({
  type: ACTION_SET_POOL_ID,
  payload,
});

export const actionIniting = (payload) => ({
  type: ACTION_SET_INITIING,
  payload,
});

export const actionSetSellTokenFetched = (payload) => ({
  type: ACTION_SET_SELL_TOKEN,
  payload,
});

export const actionSetBuyTokenFetched = (payload) => ({
  type: ACTION_SET_BUY_TOKEN,
  payload,
});

export const actionSetSellToken = (selltokenId) => async (
  dispatch,
  getState,
) => {
  try {
    if (!selltokenId) {
      return;
    }
    dispatch(actionSetSellTokenFetched(selltokenId));
    const state = getState();
    const { initing } = orderLimitSelector(state);
    const selltoken: SelectedPrivacy = getPrivacyDataByTokenID(state)(
      selltokenId,
    );
    const { pDecimals, symbol } = selltoken;
    const balance = await dispatch(getBalance(selltokenId));
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
      const rateData = rateDataSelector(state);
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
      await delay(200);
      const data = {
        fee: random(1e2, 1e6),
      };
      const humanSellAmount = convert.toHumanAmount(
        sellOriginalAmount,
        pDecimals,
      );
      sellamount = format.toFixed(humanSellAmount, pDecimals);
      const buyInputAmount = format.toFixed(
        new BigNumber(humanSellAmount)
          .multipliedBy(new BigNumber(rateData?.rate || 0))
          .toNumber(),
        buytoken?.pDecimals,
      );
      const amountFee = format.toFixed(
        convert.toHumanAmount(data.fee, feeTokenData?.pDecimals),
        feeTokenData.pDecimals,
      );
      dispatch(
        change(formConfigs.formName, formConfigs.buytoken, buyInputAmount),
      );
      dispatch(change(formConfigs.formName, formConfigs.feetoken, amountFee));
      await dispatch(actionFetched({ ...data }));
    } else {
      sellamount = format.toFixed(
        convert.toHumanAmount(sellOriginalAmount, pDecimals),
        pDecimals,
      );
    }
    dispatch(change(formConfigs.formName, formConfigs.selltoken, sellamount));
    dispatch(focus(formConfigs.formName, formConfigs.selltoken));
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

export const actionInit = () => async (dispatch, getState) => {
  try {
    let state = getState();
    const pool = poolSelectedDataSelector(state);
    await dispatch(actionSetPercent(0));
    if (isEmpty(pool)) {
      return;
    }
    await dispatch(actionIniting(true));
    const activedTab = activedTabSelector(state)(ROOT_TAB_ORDER_LIMIT);
    const token1: SelectedPrivacy = pool?.token1;
    const token2: SelectedPrivacy = pool?.token2;
    let selltoken, buytoken;
    switch (activedTab) {
    case TAB_BUY_ID: {
      selltoken = token2.tokenId;
      buytoken = token1.tokenId;
      break;
    }
    case TAB_SELL_ID: {
      selltoken = token1.tokenId;
      buytoken = token2.tokenId;
      break;
    }
    default:
      break;
    }
    batch(() => {
      dispatch(actionSetSellTokenFetched(selltoken));
      dispatch(actionSetBuyTokenFetched(buytoken));
      dispatch(actionSetFeeToken(PRV.id));
    });
    state = getState();
    const rateData = rateDataSelector(state);
    dispatch(
      change(formConfigs.formName, formConfigs.rate, rateData?.rateText || ''),
    );
    await dispatch(actionSetInputToken({ selltoken, buytoken }));
  } catch (error) {
    new ExHandler(error).showErrorToast;
  } finally {
    await dispatch(actionIniting(false));
  }
};

export const actionEstimateTrade = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const inputAmount = inputAmountSelector(state);
    const sellInputAmount = inputAmount(formConfigs.selltoken);
    const buyInputAmount = inputAmount(formConfigs.buytoken);
    const feetokenData = feetokenDataSelector(state);
    if (
      isEmpty(sellInputAmount) ||
      isEmpty(buyInputAmount) ||
      isEmpty(feetokenData)
    ) {
      return;
    }
    const selltoken = sellInputAmount.tokenId;
    const buytoken = buyInputAmount.tokenId;
    const sellsymbol = sellInputAmount.symbol;
    const buysymbol = buyInputAmount.symbol;
    const amount = sellInputAmount.originalAmount;
    if (!selltoken || !buytoken || !amount) {
      return;
    }
    // const payload = {
    //   selltoken,
    //   buytoken,
    //   feetoken,
    //   amount,
    // };
    await dispatch(actionFetching());
    const otaKey = otaKeyOfDefaultAccountSelector(state);
    // const pDexV3Inst = await getPDexV3Instance({ otaKey });
    await delay(200);
    const data = {
      fee: random(1e2, 1e6),
    };
    // await pDexV3Inst.getEstimateTrade(payload);
    const amountFee = format.toFixed(
      convert.toHumanAmount(data.fee, feetokenData.pDecimals),
      feetokenData.pDecimals,
    );
    dispatch(change(formConfigs.formName, formConfigs.feetoken, amountFee));
    await dispatch(actionFetched({ ...data }));
  } catch (error) {
    console.log('actionEstimateTrade-ERROR', error);
    await dispatch(actionFetchFail());
    new ExHandler(error).showErrorToast();
  }
};
