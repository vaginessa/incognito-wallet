import random from 'lodash/random';
import max from 'lodash/max';
import min from 'lodash/min';
import { ExHandler } from '@src/services/exception';
import { getPDexV3Instance, actionGetPDexV3Inst } from '@screens/PDexV3';
import { defaultAccountWalletSelector } from '@src/redux/selectors/account';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_FETCHED_PRICE_HISTORY,
  ACTION_CHANGE_PERIOD,
  ACTION_CHANGE_DATA_POINT,
  ACTION_FETCHED_ORDER_BOOK,
  ACTION_SET_SELECTED_POOL_ID,
} from './Chart.constant';
import { priceHistorySelector, orderBookSelector } from './Chart.selector';

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

export const actionFetchedPriceHistory = (payload) => ({
  type: ACTION_FETCHED_PRICE_HISTORY,
  payload,
});

export const actionChangePeriod = (payload) => ({
  type: ACTION_CHANGE_PERIOD,
  payload,
});

export const actionChangeDataPoint = (payload) => ({
  type: ACTION_CHANGE_DATA_POINT,
  payload,
});

export const actionFetchPriceHistory = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const account = defaultAccountWalletSelector(state);
    const pdexV3Inst = await getPDexV3Instance({ account });
    const { period, datapoint } = priceHistorySelector(state);
    const now = new Date();
    const data = [...Array(datapoint)].map((item, index, arr) => {
      let before = new Date();
      switch (period) {
      case '15m':
        before.setMinutes(now.getMinutes() - 15 * index);
        break;
      case '1h':
        before.setHours(now.getHours() - 1 * index);
        break;
      case '4h':
        before.setHours(now.getHours() - 4 * index);
        break;
      case '1d':
        before.setDate(now.getDate() - 1 * index);
        break;
      case '1w':
        before.setDate(now.getDate() - 7 * index);
        break;
      case '1m':
        before.setMonth(now.getMonth() + 1 - 7 * index);
        break;
      case '1y':
        before.setFullYear(now.getFullYear() - 1 * index);
        break;
      default:
        break;
      }
      return {
        x: before,
        y: random(2e4, 6e4),
      };
    });
    const maxValue = max(data, (i) => i.y).y;
    const minValue = min(data, (i) => i.y).y;
    dispatch(
      actionFetchedPriceHistory({
        data,
        maxValue,
        minValue,
      }),
    );
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionFetchedOrderBook = (payload) => ({
  type: ACTION_FETCHED_ORDER_BOOK,
  payload,
});

export const actionFetchOrderBook = () => async (dispatch, getState) => {
  let data = [];
  try {
    const state = getState();
    const pdexV3Inst = await dispatch(actionGetPDexV3Inst());
    const { decimal, poolid } = orderBookSelector(state);
    data = await pdexV3Inst.getOrderBook({
      poolid,
      decimal,
    });
    data.sell = data.sell || [];
    data.buy = data.buy || [];
    await dispatch(actionFetchedOrderBook(data));
  } catch (error) {
    console.log('error actionFetchOrderBook', error);
    new ExHandler(error).showErrorToast();
  }
  return data;
};

export const actionFetch = () => async (dispatch, getState) => {
  try {
    await dispatch(actionFetching());
    await Promise.all([
      dispatch(actionFetchPriceHistory()),
      dispatch(actionFetchOrderBook()),
    ]);
    await dispatch(actionFetched());
  } catch (error) {
    await dispatch(actionFetchFail());
  }
};

export const actionSetSelectedPool = (payload) => ({
  type: ACTION_SET_SELECTED_POOL_ID,
  payload,
});
