import orderBy from 'lodash/orderBy';
import { Validator } from 'incognito-chain-web-js/build/wallet';
import { createSelector } from 'reselect';
import formatUtil from '@src/utils/format';
import { decimalDigitsSelector } from '@src/screens/Setting';
import { PRV } from '@src/constants/common';
import { selectedPrivacy } from './selectedPrivacy';
import { TX_STATUS_COLOR } from '../utils/history';

const renderAmount = ({ amount, pDecimals, decimalDigits } = {}) => {
  let amountStr = '';
  try {
    new Validator('amount', amount).amount();
    new Validator('pDecimals', pDecimals).number();
    new Validator('decimalDigits', decimalDigits).boolean();
    const amountToNumber = Number(amount) || 0;
    if (amountToNumber) {
      amountStr = formatUtil.amount(amount, pDecimals, true, decimalDigits);
    }
  } catch (error) {
    console.log(error);
  }
  return amountStr;
};

export const historySelector = createSelector(
  (state) => state.history,
  (history) => history,
);

export const mappingTxTransactorSelector = createSelector(
  selectedPrivacy,
  decimalDigitsSelector,
  (selectedPrivacy, decimalDigits) => (txt) => {
    new Validator('txt', txt).required().object();
    const { pDecimals } = selectedPrivacy;
    let { time, amount, fee, status } = txt;
    const timeStr = formatUtil.formatDateTime(time);
    const amountStr = renderAmount({
      amount,
      pDecimals,
      decimalDigits,
    });
    const result = {
      ...txt,
      feeStr: renderAmount({
        amount: fee,
        pDecimals: PRV.pDecimals,
        decimalDigits: false,
      }),
      amountStr,
      timeStr,
      statusColor: TX_STATUS_COLOR[status],
    };
    return result;
  },
);

export const historyTransactorSelector = createSelector(
  historySelector,
  mappingTxTransactorSelector,
  ({ txsTransactor }, mappingTxt) =>
    txsTransactor.map((txt) => mappingTxt(txt)),
);

export const mappingTxRecieverSelector = createSelector(
  selectedPrivacy,
  decimalDigitsSelector,
  ({ pDecimals }, decimalDigits) => (txr) => {
    const result = {
      ...txr,
      timeStr: formatUtil.formatDateTime(txr?.time),
      amountStr: renderAmount({
        amount: txr?.amount,
        pDecimals,
        decimalDigits,
      }),
      statusColor: TX_STATUS_COLOR[(txr?.status)],
    };
    return result;
  },
);

export const historyReceiverSelector = createSelector(
  historySelector,
  mappingTxRecieverSelector,
  ({ txsReceiver }, mappingTxr) => txsReceiver.map((txr) => mappingTxr(txr)),
);

export const historyTxsSelector = createSelector(
  historySelector,
  historyTransactorSelector,
  historyReceiverSelector,
  (history, txsTransactor, txsReceiver) => {
    const { isFetching, isFetched } = history;
    const histories = [...txsTransactor, ...txsReceiver] || [];
    const sort = orderBy(histories, 'time', 'desc');
    return {
      ...history,
      isEmpty: histories.length === 0 && !isFetching && isFetched,
      refreshing: isFetching,
      oversize: true,
      histories: [...sort],
    };
  },
);

export const historyDetailSelector = createSelector(
  historySelector,
  ({ detail }) => detail,
);
