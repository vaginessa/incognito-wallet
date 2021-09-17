import {formValueSelector} from 'redux-form';
import convert from '@utils/convert';
import format from '@utils/format';
import {MESSAGES} from '@screens/Dex/constants';
import BigNumber from 'bignumber.js';

const convertAmount = ({ originalNum, pDecimals }) => {
  const humanAmount = convert.toHumanAmount(originalNum, pDecimals);
  return format.toFixed(humanAmount, pDecimals);
};

export const getInputAmount = (
  state,
  isGettingBalance,
  tokens,
  { feeAmount, feeToken }
) => (formName, field) => {
  try {
    const token = tokens[field];
    if (!token || !token.tokenId) {
      return {
        amount: '',
        originalAmount: 0,
        loadingBalance: true
      };
    }

    const selector = formValueSelector(formName);

    const inputAmountStr = selector(state, field);
    let amount = convert.toNumber(inputAmountStr, true) || 0;
    const originalInputAmount = convert.toOriginalAmount(amount, token.pDecimals);
    let maxOriginalAmount = token.amount || 0;
    let maxOriginalAmountText = convertAmount({
      originalNum: maxOriginalAmount,
      pDecimals: token.pDecimals
    });
    if ((token.tokenId === feeToken) && (maxOriginalAmount - feeAmount) > 0) {
      maxOriginalAmount = maxOriginalAmount - feeAmount;
      maxOriginalAmountText = convertAmount({
        originalNum: maxOriginalAmount,
        pDecimals: token.pDecimals
      });
    }
    let error = undefined;
    if ((feeToken === token.tokenId) && (new BigNumber(feeAmount).gt(new BigNumber(maxOriginalAmount)))) {
      error = MESSAGES.NOT_ENOUGH_NETWORK_FEE;
    }
    if (new BigNumber(originalInputAmount).gt(new BigNumber(maxOriginalAmount))) {
      error = MESSAGES.BALANCE_INSUFFICIENT;
    }

    if (!originalInputAmount) {
      error = MESSAGES.NEGATIVE_NUMBER;
    }

    return {
      tokenId: token.tokenId,
      symbol: token.symbol,
      pDecimals: token.pDecimals,

      originalInputAmount,
      inputAmountStr,

      maxOriginalAmount,
      maxOriginalAmountText,

      loadingBalance: isGettingBalance.includes(token.tokenId),
      balance: token.amount,
      balanceStr: format.amountFull(token.amount, token.pDecimals, false),
      error,
    };
  } catch (error) {
    console.log('inputAmountSelector error', error);
  }
};
