import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  RFTradeInputAmount as TradeInputAmount,
  validator,
} from '@components/core/reduxForm';
import { change, Field } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from '@src/components/core';
import format from '@src/utils/format';
import BigNumber from 'bignumber.js';
import convert from '@src/utils/convert';
import SelectPercentAmount from '@src/components/SelectPercentAmount';
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
  selectPercentAmountContainer: {
    marginVertical: 30,
  },
});

const SellInput = React.memo(() => {
  const orderLimitData = useSelector(orderLimitDataSelector);
  const dispatch = useDispatch();
  const inputAmount = useSelector(inputAmountSelector);
  const sellInputAmount = inputAmount(formConfigs.selltoken);
  const buyInputAmount = inputAmount(formConfigs.buytoken);
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
  const onPressInfinityIcon = async () => {
    dispatch(
      change(
        formConfigs.formName,
        formConfigs.selltoken,
        sellInputAmount?.availableAmountText,
      ),
    );
    changeBuyAmount(sellInputAmount?.availableAmountText);
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
  const sellInputAmount = inputAmount(formConfigs.selltoken);
  const buyInputAmount = inputAmount(formConfigs.buytoken);
  const orderLimitData = useSelector(orderLimitDataSelector);
  const { customRate } = useSelector(rateDataSelector);
  const changeSellAmount = (buyamount) => {
    let amount = convert.toNumber(buyamount, true) || 0;
    let originalAmount = convert.toOriginalAmount(
      amount,
      buyInputAmount?.pDecimals,
    );
    amount = convert.toHumanAmount(originalAmount, buyInputAmount?.pDecimals);
    const sellAmount = format.toFixed(
      new BigNumber(amount).dividedBy(new BigNumber(customRate)).toNumber(),
      sellInputAmount?.pDecimals,
    );
    dispatch(change(formConfigs.formName, formConfigs.selltoken, sellAmount));
  };
  const onEndEditing = () => {
    changeSellAmount(buyInputAmount.amount);
    dispatch(actionEstimateTrade());
  };
  const onChange = (buyamount) => {
    try {
      dispatch(change(formConfigs.formName, formConfigs.buytoken, buyamount));
      if (typeof validator.number()(buyamount) !== 'undefined') {
        dispatch(change(formConfigs.formName, formConfigs.selltoken, ''));
        return;
      }
      changeSellAmount(buyamount);
    } catch (error) {
      console.log('BuyInput-onChange-error', error);
    }
  };
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
      onChange={onChange}
    />
  );
});

const InputsGroup = React.memo(() => {
  const { activedTab, mainColor } = useSelector(orderLimitDataSelector);
  const dispatch = useDispatch();
  const inputAmount = useSelector(inputAmountSelector);
  const sellInputAmount = inputAmount(formConfigs.selltoken);
  const buyInputAmount = inputAmount(formConfigs.buytoken);
  const { customRate } = useSelector(rateDataSelector);
  const handleSelectPercent = (percent) => {
    let _percent = percent / 100;
    let amount =
      convert.toNumber(sellInputAmount?.availableAmountText, true) || 0;
    let originalAmount = convert.toOriginalAmount(
      new BigNumber(amount).multipliedBy(_percent).toNumber(),
      sellInputAmount?.pDecimals,
    );
    amount = convert.toHumanAmount(originalAmount, sellInputAmount?.pDecimals);
    const amounText = format.toFixed(amount, sellInputAmount?.pDecimals);
    const buyAmount = format.toFixed(
      new BigNumber(amount).multipliedBy(new BigNumber(customRate)).toNumber(),
      buyInputAmount?.pDecimals,
    );
    dispatch(change(formConfigs.formName, formConfigs.buytoken, buyAmount));
    dispatch(change(formConfigs.formName, formConfigs.selltoken, amounText));
    dispatch(actionEstimateTrade());
  };
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
  return (
    <View style={styled.container}>
      {renderMain()}
      <SelectPercentAmount
        size={4}
        handleSelectPercent={handleSelectPercent}
        containerStyled={styled.selectPercentAmountContainer}
        percentBtnColor={mainColor}
      />
    </View>
  );
});

export default InputsGroup;
