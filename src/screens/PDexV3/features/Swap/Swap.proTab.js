import { Text } from '@src/components/core';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Extra, {
  Hook,
  styled as extraStyled,
} from '@screens/PDexV3/features/Extra';
import { useDispatch, useSelector } from 'react-redux';
import { Field } from 'redux-form';
import {
  RFBaseInput,
  RFSelectFeeInput,
  validator,
} from '@src/components/core/reduxForm';
import {
  feetokenDataSelector,
  feeTypesSelector,
  inputAmountSelector,
  slippagetoleranceSelector,
  swapInfoSelector,
} from './Swap.selector';
import { actionEstimateTrade, actionSetFeeToken } from './Swap.actions';
import { formConfigs } from './Swap.constant';
import { MaxPriceAndImpact } from './Swap.shared';
import {
  minFeeValidator,
  avaliablePayFeeByBuyTokenValidator,
  maxAmountValidatorForSlippageTolerance,
} from './Swap.utils';

const styled = StyleSheet.create({
  container: {
    marginTop: 30,
  },
});

const TabPro = React.memo(() => {
  const swapInfo = useSelector(swapInfoSelector);
  const feeTypes = useSelector(feeTypesSelector);
  const slippagetolerance = useSelector(slippagetoleranceSelector);
  const feetokenData = useSelector(feetokenDataSelector);
  const inputAmount = useSelector(inputAmountSelector);
  const buyinputAmount = inputAmount(formConfigs.buytoken);
  const dispatch = useDispatch();
  const onChangeTypeFee = async (type) => {
    const { tokenId } = type;
    await dispatch(actionSetFeeToken(tokenId));
    dispatch(actionEstimateTrade());
  };
  const onEndEditing = () => {
    if (Number(slippagetolerance) > 100 || slippagetolerance < 0) {
      return;
    }
    dispatch(actionEstimateTrade());
  };
  let _minFeeValidator = React.useCallback(
    () => minFeeValidator(feetokenData),
    [
      feetokenData?.origininalFeeAmount,
      feetokenData?.minFeeOriginal,
      feetokenData?.symbol,
      feetokenData?.minFeeAmountText,
    ],
  );
  let _avaliablePayFeeByBuyTokenValidator = React.useCallback(
    () => avaliablePayFeeByBuyTokenValidator(buyinputAmount),
    [
      buyinputAmount?.usingFee,
      buyinputAmount?.availableOriginalAmount,
      buyinputAmount?.symbol,
    ],
  );
  let _maxAmountValidatorForSlippageTolerance = React.useCallback(
    () => maxAmountValidatorForSlippageTolerance(slippagetolerance),
    [slippagetolerance],
  );
  const extraFactories = [
    {
      title: 'Slippage tolerance',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
      hooks: (
        <Field
          component={RFBaseInput}
          name={formConfigs.slippagetolerance}
          rightCustom={<Text style={extraStyled.value}>%</Text>}
          keyboardType="decimal-pad"
          placeholder="0"
          ellipsizeMode="tail"
          numberOfLines={1}
          onEndEditing={onEndEditing}
          validate={[
            ...validator.combinedNumber,
            _maxAmountValidatorForSlippageTolerance,
          ]}
        />
      ),
    },
    {
      title: 'Trading fee',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
      hooks: (
        <Field
          component={RFSelectFeeInput}
          types={feeTypes}
          onChangeTypeFee={onChangeTypeFee}
          name={formConfigs.feetoken}
          placeholder="0"
          validate={[
            ...validator.combinedAmount,
            _minFeeValidator,
            _avaliablePayFeeByBuyTokenValidator,
          ]}
        />
      ),
    },
    {
      title: 'Trade details',
      hooks: [
        {
          label: 'Balance',
          value: swapInfo?.balanceStr ?? '',
        },
        {
          label: 'Max price &  impact',
          hasQuestionIcon: true,
          onPressQuestionIcon: () => null,
          customValue: <MaxPriceAndImpact />,
        },
        {
          label: 'Routing',
          value: swapInfo?.routing ?? '',
          hasQuestionIcon: true,
          onPressQuestionIcon: () => null,
        },
      ].map((hook) => <Hook {...hook} key={hook.label} />),
    },
  ];
  return (
    <View style={styled.container}>
      {extraFactories.map((extra) => (
        <Extra {...extra} key={extra.label} />
      ))}
    </View>
  );
});

export default React.memo(TabPro);
