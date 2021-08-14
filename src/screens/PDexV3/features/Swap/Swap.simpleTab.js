import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Hook } from '@screens/PDexV3/features/Extra';
import { useDispatch, useSelector } from 'react-redux';
import { swapInfoSelector } from './Swap.selector';
import { MaxPriceAndImpact } from './Swap.shared';

const styled = StyleSheet.create({
  container: {
    marginTop: 30,
  },
});

const TabSimple = React.memo(() => {
  const swapInfo = useSelector(swapInfoSelector);
  const hooksFactories = [
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
      label: 'Trading fee',
      value: swapInfo?.minFeeAmountStr ?? '',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
      boldLabel: true,
    },
    {
      label: 'Network fee',
      value: swapInfo?.networkfeeAmountStr ?? '',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
      boldLabel: true,
    },
  ];
  return (
    <View style={styled.container}>
      {hooksFactories.map((item) => (
        <Hook {...item} key={item.label} />
      ))}
    </View>
  );
});

export default React.memo(TabSimple);
