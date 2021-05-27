import {
  Validator,
  ACCOUNT_CONSTANT,
} from 'incognito-chain-web-js/build/wallet';
import { createSelector } from 'reselect';
import formatUtil from '@src/utils/format';
import { decimalDigitsSelector } from '@src/screens/Setting';
import { selectedPrivacy } from './selectedPrivacy';

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

export const historyTransactorSelector = createSelector(
  historySelector,
  selectedPrivacy,
  decimalDigitsSelector,
  ({ txsTransactor }, selectedPrivacy, decimalDigits) =>
    txsTransactor.map((ht) => {
      const { pDecimals, isMainCrypto } = selectedPrivacy;
      const {
        txId,
        amount,
        status,
        txType,
        tx,
        fee,
        receivers,
        tokenReceivers,
      } = ht;
      const statusStr = ACCOUNT_CONSTANT.TX_STATUS_STR[status];
      const txTypeStr = ACCOUNT_CONSTANT.TX_TYPE_STR[txType];
      const time = tx?.LockTime * 1000;
      const timeStr = formatUtil.formatDateTime(time);
      const receiverAddress = isMainCrypto ? receivers[0] : tokenReceivers[0];
      const result = {
        txId,
        amount,
        amountStr: renderAmount({ amount, pDecimals, decimalDigits }),
        status,
        statusStr,
        txType,
        txTypeStr,
        time,
        timeStr,
        fee,
        receiverAddress,
      };
      console.log('data', result);
      return result;
    }),
);

const historyReceiverSelector = createSelector(
  historySelector,
  selectedPrivacy,
  decimalDigitsSelector,
  ({ txsReceiver }, { pDecimals }, decimalDigits) =>
    txsReceiver.map((tx) => ({
      ...tx,
      timeStr: formatUtil.formatDateTime(tx?.lockTime),
      amountStr: renderAmount({ amount: tx?.amount, pDecimals, decimalDigits }),
    })),
);

export const historyTxsSelector = createSelector(
  historySelector,
  historyTransactorSelector,
  historyReceiverSelector,
  (history, txsTransactor, txsReceiver) => {
    const { isFetching } = history;
    const histories = [...txsTransactor, ...txsReceiver] || [];
    return {
      ...history,
      isEmpty: histories.length === 0,
      refreshing: isFetching,
      oversize: true,
      histories,
    };
  },
);
