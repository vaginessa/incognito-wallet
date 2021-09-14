import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Hook, styled as extraStyled } from '@screens/PDexV3/features/Extra';
import { useSelector } from 'react-redux';
import { Text } from '@src/components/core';
import isEmpty from 'lodash/isEmpty';
import {
  feetokenDataSelector,
  swapInfoSelector,
  slippagetoleranceSelector,
} from './Swap.selector';
import { MaxPriceAndImpact } from './Swap.shared';

const styled = StyleSheet.create({
  container: {
    marginTop: 30,
  },
});

export const useTabFactories = () => {
  const swapInfo = useSelector(swapInfoSelector);
  const feeTokenData = useSelector(feetokenDataSelector);
  const slippagetolerance = useSelector(slippagetoleranceSelector);
  const hooksFactories = React.useMemo(() => {
    let result = [
      {
        label: 'Balance',
        value: swapInfo?.balanceStr ?? '',
      },
      swapInfo?.showPRVBalance
        ? {
          label: 'PRV Balance',
          value: swapInfo?.prvBalanceStr ?? '',
        }
        : {},
      {
        label: 'Max price &  impact',
        hasQuestionIcon: true,
        onPressQuestionIcon: () => null,
        customValue: <MaxPriceAndImpact />,
      },
      {
        label: 'Slippage tolerance',
        value: slippagetolerance || '',
        hasQuestionIcon: true,
        onPressQuestionIcon: () => null,
      },
      {
        label: 'Trading fee',
        value: feeTokenData?.feeAmountText ?? '',
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
      {
        label: 'Pool size',
        hasQuestionIcon: true,
        onPressQuestionIcon: () => null,
        boldLabel: true,
        customValue: (
          <View
            style={{
              flex: 1,
            }}
          >
            {swapInfo?.allPoolSize &&
              swapInfo?.allPoolSize.map((poolSize) => (
                <Text
                  style={{ ...extraStyled.value, marginBottom: 5 }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {poolSize}
                </Text>
              ))}
          </View>
        ),
      },
    ];
    return result.filter((hook) => !isEmpty(hook));
  }, [swapInfo]);
  return {
    hooksFactories,
  };
};

const TabSimple = React.memo(() => {
  const { hooksFactories } = useTabFactories();
  return (
    <View style={styled.container}>
      {hooksFactories.map((item) => (
        <Hook {...item} key={item.label} />
      ))}
    </View>
  );
});

export default React.memo(TabSimple);
