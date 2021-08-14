import { Text } from '@src/components/core';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Extra, {
  Hook,
  styled as extraStyled,
} from '@screens/PDexV3/features/Extra';
import { useDispatch, useSelector } from 'react-redux';
import { Field } from 'redux-form';
import { RFBaseInput, RFSelectFeeInput } from '@src/components/core/reduxForm';
import {
  feeTypesSelector,
  slippagetoleranceSelector,
  swapInfoSelector,
} from './Swap.selector';
import { actionEstimateTrade, actionSetFeeToken } from './Swap.actions';
import { formConfigs } from './Swap.constant';
import { MaxPriceAndImpact } from './Swap.shared';

const styled = StyleSheet.create({
  container: {
    marginTop: 30,
  },
});

const TabPro = React.memo(() => {
  const swapInfo = useSelector(swapInfoSelector);
  const feeTypes = useSelector(feeTypesSelector);
  const slippagetolerance = useSelector(slippagetoleranceSelector);
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
