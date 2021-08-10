import { Text } from '@src/components/core';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Hook, styled as extraStyled } from './Swap.extra';

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
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
      customValue: (
        <Text numberOfLines={1} ellipsizeMode="tail" style={extraStyled.value}>
          1.99 PRV/USDC{' '}
          <Text style={[extraStyled.value, extraStyled.orangeValue]}>
            (10%)
          </Text>
        </Text>
      ),
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
