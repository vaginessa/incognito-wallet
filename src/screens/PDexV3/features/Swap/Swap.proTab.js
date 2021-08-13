import { Text } from '@src/components/core';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Extra, {
  Hook,
  styled as extraStyled,
} from '@screens/PDexV3/features/Extra';

const styled = StyleSheet.create({
  container: {
    marginTop: 30,
  },
});

const TabPro = React.memo(() => {
  const extraFactories = [
    {
      title: 'Slippage tolerance',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
      hooks: null,
    },
    {
      title: 'Trading fee',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
      hooks: null,
    },
    {
      title: 'Trade details',
      hooks: [
        {
          label: 'Balance',
          value: '700 USDC + 3000 PRV',
        },
        {
          label: 'Max price &  impact',
          hasQuestionIcon: true,
          onPressQuestionIcon: () => null,
          customValue: (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={extraStyled.value}
            >
              2 PRV/USDC{' '}
              <Text style={[extraStyled.value, extraStyled.orangeValue]}>
                (9.9%)
              </Text>
            </Text>
          ),
        },
        {
          label: 'Routing',
          value: 'USDC > ETH > PRV',
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
