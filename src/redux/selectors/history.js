import orderBy from 'lodash/orderBy';
import {
  Validator,
  ACCOUNT_CONSTANT,
} from 'incognito-chain-web-js/build/wallet';
import { createSelector } from 'reselect';
import formatUtil from '@src/utils/format';
import { decimalDigitsSelector } from '@src/screens/Setting';
import { selectedPrivacy } from './selectedPrivacy';
import { TX_STATUS_COLOR } from '../utils/history';

const renderAmount = ({ amount, pDecimals, decimalDigits } = {}) => {
  new Validator('amount', amount).amount();
  new Validator('pDecimals', pDecimals).number();
  new Validator('decimalDigits', decimalDigits).boolean();
  let amountStr = '';
  const amountToNumber = Number(amount) || 0;
  if (amountToNumber) {
    amountStr = formatUtil.amount(amount, pDecimals, true, decimalDigits);
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
    const { pDecimals, isMainCrypto } = selectedPrivacy;
    let {
      txId,
      amount,
      status,
      txType,
      tx,
      fee,
      receivers,
      tokenReceivers,
      memo,
      tokenAmount,
    } = txt;
    tx = isMainCrypto ? txt?.tx : txt?.tx?.Tx;
    const statusStr = ACCOUNT_CONSTANT.TX_STATUS_STR[status];
    const txTypeStr = ACCOUNT_CONSTANT.TX_TYPE_STR[txType];
    const time = tx?.LockTime * 1000;
    const timeStr = formatUtil.formatDateTime(time);
    const receiverAddress = isMainCrypto ? receivers[0] : tokenReceivers[0];
    const _amount = isMainCrypto ? amount : tokenAmount;
    const amountStr = renderAmount({
      amount: _amount,
      pDecimals,
      decimalDigits,
    });
    const result = {
      txId,
      amount,
      amountStr,
      status,
      statusStr,
      txType,
      txTypeStr,
      time,
      timeStr,
      fee,
      feeStr: renderAmount({ amount: fee, pDecimals, decimalDigits: false }),
      receiverAddress,
      statusColor: TX_STATUS_COLOR[status],
      memo,
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
      timeStr: formatUtil.formatDateTime(txr?.lockTime),
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
