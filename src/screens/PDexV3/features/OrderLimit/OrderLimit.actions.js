import { PrivacyVersion } from 'incognito-chain-web-js/build/wallet';
import { activedTabSelector } from '@src/components/core/Tabs/Tabs.selector';
import { PRV } from '@src/constants/common';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { getBalance } from '@src/redux/actions/token';
import { getPrivacyDataByTokenID } from '@src/redux/selectors/selectedPrivacy';
import { ExHandler } from '@src/services/exception';
import {
  actionFetchListFollowingPools,
  // actionFetchPools,
} from '@screens/PDexV3/features/Pools';
import convert from '@src/utils/convert';
import { delay } from '@src/utils/delay';
import format from '@src/utils/format';
import BigNumber from 'bignumber.js';
import isEmpty from 'lodash/isEmpty';
import { batch } from 'react-redux';
import { change, focus } from 'redux-form';
import { v4 } from 'uuid';
import { actionGetPDexV3Inst } from '@screens/PDexV3';
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
  ACTION_FETCHED_OPEN_ORDERS,
  ACTION_CANCELING_ORDER,
  ACTION_FETCHED_CANCELING_ORDER_TXS,
  ACTION_FETCH_ORDERING,
} from './OrderLimit.constant';
import {
  buytokenSelector,
  // feetokenDataSelector,
  // inputAmountSelector,
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
    const selltoken: SelectedPrivacy = getPrivacyDataByTokenID(state)(
      selltokenId,
    );
    const { pDecimals } = selltoken;
    const balance = await dispatch(getBalance(selltokenId));
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
    sellamount = format.toFixed(
      convert.toHumanAmount(sellOriginalAmount, pDecimals),
      pDecimals,
    );
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
    await dispatch(actionSetSellToken(selltoken));
    await dispatch(actionSetBuyToken(buytoken));
    if (selltoken !== PRV.id && buytoken !== PRV.id) {
      dispatch(getBalance(PRV.id));
    }
  } catch (error) {
    throw error;
  }
};

export const actionInit = () => async (dispatch, getState) => {
  try {
    await dispatch(actionIniting(true));
    await dispatch(actionFetchListFollowingPools());
    let state = getState();
    const pool = poolSelectedDataSelector(state);
    await dispatch(actionSetPercent(0));
    if (isEmpty(pool)) {
      return;
    }
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
    await dispatch(actionSetSellToken(selltoken));

    await dispatch(actionSetInputToken({ selltoken, buytoken }));
    // const rateData = rateDataSelector(state);
    // dispatch(
    //   change(
    //     formConfigs.formName,
    //     formConfigs.rate,
    //     rateData?.customRate || '',
    //   ),
    // );
  } catch (error) {
    new ExHandler(error).showErrorToast;
  } finally {
    await dispatch(actionIniting(false));
  }
};

export const actionFetchedOpenOrders = (payload) => ({
  type: ACTION_FETCHED_OPEN_ORDERS,
  payload,
});

export const actionFetchedCancelingOrderTxs = (payload) => ({
  type: ACTION_FETCHED_CANCELING_ORDER_TXS,
  payload,
});

export const actionFetchCancelingOrderTxs = () => async (
  dispatch,
  getState,
) => {
  let cancelingTxs = [];
  try {
    const state = getState();
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const pool = poolSelectedDataSelector(state);
    if (!pool?.poolId) {
      return [];
    }
    const poolid = pool?.poolId;
    await delay(1000);
    cancelingTxs = await pDexV3Inst.getCancelingOrderTxs({
      poolid,
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    await dispatch(actionFetchedCancelingOrderTxs(cancelingTxs));
  }
};

export const actionFetchOpenOrders = () => async (dispatch, getState) => {
  let orders = [];
  try {
    const state = getState();
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const pool = poolSelectedDataSelector(state);
    if (!pool) {
      return;
    }
    orders = await pDexV3Inst.getOrderLimitHistory({
      poolid: pool?.poolId,
      version: PrivacyVersion.ver2,
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionFetchedOpenOrders(orders));
  }
};

export const actionCancelingOrder = (payload) => ({
  type: ACTION_CANCELING_ORDER,
  payload,
});

export const actionCancelOrder = (requesttx) => async (dispatch, getState) => {
  try {
    const state = getState();
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const pool = poolSelectedDataSelector(state);
    if (!requesttx || !pool?.poolId) {
      return;
    }
    await dispatch(actionCancelingOrder(requesttx));
    const poolid = pool?.poolId;
    await delay(1000);
    // create tx to cancel order => cancelOrderTxId
    const txCancel = {
      cancelTxId: v4(),
      status: -1,
      requesttx,
    };
    console.log('txCancel', txCancel);
    await pDexV3Inst.setCancelingOrderTx({
      txCancel,
      poolid,
    });
    await dispatch(actionFetchCancelingOrderTxs());
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    await dispatch(actionCancelingOrder(requesttx));
  }
};

export const actionFetchingBookOrder = (payload) => ({
  type: ACTION_FETCH_ORDERING,
  payload,
});

export const actionBookOrder = () => async (dispatch, getState) => {
  await dispatch(actionFetchingBookOrder(true));
  try {
    //
  } catch (error) {
    throw error;
  } finally {
    await dispatch(actionFetchingBookOrder(false));
  }
};

/**
  {
    PoolID: "0000000000000000000000000000000000000000000000000000000000000004-6133dbf8e3d71a8f8e406ebd459492d34180622ba572b2d8f0fc8484b09ddd47-1437fbee7030f8e0d52ddb157edb2d4f61d4ca851a161f5f716d754951e57337",
    Token1ID: "0000000000000000000000000000000000000000000000000000000000000004",
    Token2ID: "6133dbf8e3d71a8f8e406ebd459492d34180622ba572b2d8f0fc8484b09ddd47",
    // Token1Value: 1000,
    // Token2Value: 2000,
    VirtualToken1Value: x_v,
    VirtualToken2Value: y_v,
    Share: 0,
    AMP: 20000,
    Price: 0,
    Volume: 0,
    PriceChange24h: 0,
    APY: 0
  }

  x0: 1e9
  y0 = y_v - (x_v * y_x) / (x0 + x_v) 


 */
