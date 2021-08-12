import { getBalance } from '@src/redux/actions/token';
import { ExHandler } from '@src/services/exception';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_SET_SELL_TOKEN,
  ACTION_SET_BUY_TOKEN,
  ACTION_SET_FEE_TOKEN,
} from './Swap.constant';

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

export const actionFetch = () => async (dispatch, getState) => {
  try {
    await dispatch(actionFetching());
    await dispatch(actionFetched());
  } catch (error) {
    await dispatch(actionFetchFail());
  }
};

export const actionSetSellToken = (selltoken) => async (dispatch, getState) => {
  try {
    dispatch(getBalance(selltoken));
    dispatch(actionSetSellTokenFetched(selltoken));
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

export const actionEstimateTrade = () => async (dispatch, getState) => {
  try {
    const state = getState();
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};
