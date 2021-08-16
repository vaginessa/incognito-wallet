import SelectedPrivacy from '@src/models/selectedPrivacy';
import convert from '@src/utils/convert';
import format from '@src/utils/format';
import BigNumber from 'bignumber.js';
import { formValueSelector } from 'redux-form';
import { formConfigs } from './Swap.constant';

export const minFeeValidator = (feetokenData) => {
  if (!feetokenData) {
    return undefined;
  }
  try {
    const {
      origininalFeeAmount,
      minFeeOriginal,
      symbol,
      minFeeAmountText,
    } = feetokenData;
    if (
      new BigNumber(origininalFeeAmount).isLessThan(
        new BigNumber(minFeeOriginal),
      )
    ) {
      return `Amount must be larger than ${minFeeAmountText} ${symbol}`;
    }
  } catch (error) {
    console.log('minFeeValidator-error', error);
  }
  return undefined;
};

export const avaliablePayFeeByBuyTokenValidator = (buyinputAmount) => {
  if (!buyinputAmount) {
    return undefined;
  }
  try {
    const { usingFee, availableOriginalAmount, symbol } = buyinputAmount || {};
    if (usingFee) {
      if (new BigNumber(availableOriginalAmount).isLessThan(0)) {
        return `Your ${symbol} balance is insufficient.`;
      }
    }
  } catch (error) {
    console.log('avaliablePayFeeByBuyTokenValidator-error', error);
  }
  return undefined;
};

export const maxAmountValidatorForSellInput = (sellInputAmount) => {
  try {
    if (!sellInputAmount) {
      return undefined;
    }
    const {
      originalAmount,
      availableOriginalAmount,
      symbol,
      availableAmountText,
    } = sellInputAmount || {};
    if (
      new BigNumber(originalAmount).gt(new BigNumber(availableOriginalAmount))
    ) {
      return new BigNumber(availableOriginalAmount).gt(0)
        ? `Max amount you can swap is ${availableAmountText} ${symbol}`
        : `Your ${symbol} balance is insufficient.`;
    }
  } catch (error) {
    console.log('maxAmountValidatorForSellInput-error', error);
  }

  return undefined;
};

export const maxAmountValidatorForSlippageTolerance = (slippagetolerance) => {
  try {
    if (!slippagetolerance) {
      return undefined;
    }
    const slippagetoleranceAmount = convert.toNumber(slippagetolerance, true);
    if (slippagetoleranceAmount >= 100) {
      return `Enter a number from 0 to ${format.number(99.99)} `;
    }
  } catch (error) {
    console.log('maxAmountValidatorForSlippageTolerance-error', error);
  }

  return undefined;
};

export const getInputAmount = (
  state,
  getInputToken,
  focustoken,
  feeData,
  { networkfee },
  isGettingBalance,
) => (field) => {
  try {
    const token: SelectedPrivacy = getInputToken(field);
    if (!token.tokenId) {
      return {
        amount: '',
        originalAmount: 0,
        isFocus: false,
      };
    }
    const selector = formValueSelector(formConfigs.formName);

    const amountText = selector(state, field);
    const amount = convert.toNumber(amountText, true);
    const originalAmount = convert.toOriginalAmount(amount, token.pDecimals);

    let availableOriginalAmount = token.amount || 0;
    let availableAmountNumber = 0;
    let availableAmountText = '';
    const usingFee = token.tokenId === feeData.feetoken;
    if (usingFee) {
      availableOriginalAmount = new BigNumber(availableOriginalAmount)
        .minus(new BigNumber(feeData.origininalFeeAmount))
        .toNumber();
    }
    if (usingFee && token.isMainCrypto) {
      availableOriginalAmount = new BigNumber(availableOriginalAmount)
        .minus(networkfee)
        .toNumber();
    }
    if (new BigNumber(availableOriginalAmount).isGreaterThan(0)) {
      availableAmountNumber = convert.toHumanAmount(
        availableOriginalAmount,
        token.pDecimals,
      );
      availableAmountText = format.toFixed(
        availableAmountNumber,
        token.pDecimals,
      );
    }
    const focus = token.tokenId === focustoken;
    return {
      focus,
      tokenId: token.tokenId,
      symbol: token.symbol,
      pDecimals: token.pDecimals,

      amount,
      originalAmount,
      amountText,

      availableOriginalAmount,
      availableAmountText,
      availableAmountNumber,

      usingFee,
      loadingBalance: isGettingBalance.includes(token.tokenId),

      balance: token.amount,
      balanceStr: format.amountFull(token.amount, token.pDecimals, false),
    };
  } catch (error) {
    console.log('inputAmountSelector error', error);
  }
};
