import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Hook } from './Swap.extra';

const styled = StyleSheet.create({
  container: {
    marginTop: 30,
  },
});

const TabSimple = React.memo(() => {
  const hooksFactories = [
    {
      label: 'Balance',
      value: '700 USDC + 1000 PRV',
    },
    {
      label: 'Max price &  impact',
      value: '1.99 PRV/USDC (10%)',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
    },
    {
      label: 'Trading fee',
      value: '0.3 PRV ',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
      boldLabel: true,
    },
    {
      label: 'Network fee',
      value: '0.0000001 PRV',
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
