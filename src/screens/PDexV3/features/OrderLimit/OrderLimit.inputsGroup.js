import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  RFTradeInputAmount as TradeInputAmount,
  validator,
} from '@components/core/reduxForm';
import { change, Field, getFormSyncErrors } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from '@src/components/core';
import format from '@src/utils/format';
import BigNumber from 'bignumber.js';
import convert from '@src/utils/convert';
import { maxAmountValidatorForSellInput } from './OrderLimit.utils';
import {
  inputAmountSelector,
  orderLimitDataSelector,
  rateDataSelector,
} from './OrderLimit.selector';
import { actionEstimateTrade } from './OrderLimit.actions';
import { TAB_BUY_ID, TAB_SELL_ID, formConfigs } from './OrderLimit.constant';

const styled = StyleSheet.create({
  container: {
    marginVertical: 30,
  },
  dividerStyled: {
    marginVertical: 30,
  },
});

const SellInput = React.memo(() => {
  const orderLimitData = useSelector(orderLimitDataSelector);
  const dispatch = useDispatch();
  const inputAmount = useSelector(inputAmountSelector);
  const sellInputAmount = inputAmount(formConfigs.selltoken);
  const buyInputAmount = inputAmount(formConfigs.buytoken);
  const formSyncErrors = useSelector((state) =>
    getFormSyncErrors(formConfigs.formName)(state),
  );
  const changeBuyAmount = (sellamount) => {
    let amount = convert.toNumber(sellamount, true) || 0;
    let originalAmount = convert.toOriginalAmount(
      amount,
      sellInputAmount?.pDecimals,
    );
    amount = convert.toHumanAmount(originalAmount, sellInputAmount?.pDecimals);
    const buyAmount = format.toFixed(
      new BigNumber(amount).multipliedBy(new BigNumber(customRate)).toNumber(),
      buyInputAmount?.pDecimals,
    );
    dispatch(change(formConfigs.formName, formConfigs.buytoken, buyAmount));
  };
  const onEndEditing = () => {
    changeBuyAmount(sellInputAmount.amount);
    dispatch(actionEstimateTrade());
  };
  const { customRate } = useSelector(rateDataSelector);
  const onChange = (sellamount) => {
    try {
      dispatch(change(formConfigs.formName, formConfigs.selltoken, sellamount));
      if (typeof validator.number()(sellamount) !== 'undefined') {
        dispatch(change(formConfigs.formName, formConfigs.buytoken, ''));
        return;
      }
      changeBuyAmount(sellamount);
    } catch (error) {
      console.log('SellInput-onChange-error', error);
    }
  };
  const onPressInfinityIcon = () => {
    dispatch(
      change(
        formConfigs.formName,
        formConfigs.selltoken,
        sellInputAmount?.availableAmountText,
      ),
    );
    dispatch(actionEstimateTrade());
  };
  let _maxAmountValidatorForSellInput = React.useCallback(
    () => maxAmountValidatorForSellInput(sellInputAmount),
    [
      sellInputAmount?.originalAmount,
      sellInputAmount?.availableOriginalAmount,
      sellInputAmount?.availableAmountText,
      sellInputAmount?.symbol,
    ],
  );
  if (!sellInputAmount) {
    return null;
  }
  return (
    <Field
      component={TradeInputAmount}
      name={formConfigs.selltoken} //
      hasInfinityIcon
      symbol={sellInputAmount?.symbol}
      onEndEditing={onEndEditing}
      onPressInfinityIcon={onPressInfinityIcon}
      validate={[...validator.combinedAmount, _maxAmountValidatorForSellInput]}
      loadingBalance={!!sellInputAmount?.loadingBalance}
      editableInput={!!orderLimitData?.editableInput}
      onChange={onChange}
    />
  );
});

const BuyInput = React.memo(() => {
  const dispatch = useDispatch();
  const inputAmount = useSelector(inputAmountSelector);
  const buyInputAmount = inputAmount(formConfigs.buytoken);
  const onEndEditing = () => dispatch(actionEstimateTrade());
  const orderLimitData = useSelector(orderLimitDataSelector);
  if (!buyInputAmount) {
    return null;
  }
  return (
    <Field
      component={TradeInputAmount}
      name={formConfigs.buytoken} //
      symbol={buyInputAmount?.symbol}
      onEndEditing={onEndEditing}
      validate={[...validator.combinedAmount]}
      loadingBalance={!!buyInputAmount?.loadingBalance}
      editableInput={!!orderLimitData?.editableInput}
    />
  );
});

const InputsGroup = React.memo(() => {
  const { activedTab } = useSelector(orderLimitDataSelector);
  const renderMain = () => {
    switch (activedTab) {
    case TAB_SELL_ID: {
      return (
        <>
          <SellInput />
          <Divider dividerStyled={styled.dividerStyled} />
          <BuyInput />
        </>
      );
    }
    case TAB_BUY_ID: {
      return (
        <>
          <BuyInput />
          <Divider dividerStyled={styled.dividerStyled} />
          <SellInput />
        </>
      );
    }
    default:
      return null;
    }
  };
  return <View style={styled.container}>{renderMain()}</View>;
});

export default InputsGroup;
