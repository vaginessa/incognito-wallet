import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Hook } from '@screens/PDexV3/features/Extra';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import {
  feetokenDataSelector,
  swapInfoSelector,
  slippagetoleranceSelector,
  inputAmountSelector,
} from './Swap.selector';
import { MaxPriceAndImpact } from './Swap.shared';
import { formConfigs } from './Swap.constant';

const styled = StyleSheet.create({
  container: {
    marginTop: 30,
  },
});

export const useTabFactories = () => {
  const swapInfo = useSelector(swapInfoSelector);
  const feeTokenData = useSelector(feetokenDataSelector);
  const slippagetolerance = useSelector(slippagetoleranceSelector);
  const sellInputAmount = useSelector(inputAmountSelector)(
    formConfigs.selltoken,
  );
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
    ];
    if (sellInputAmount.isMainCrypto && sellInputAmount.usingFee) {
      result.push({
        label: 'Trading fee',
        value: feeTokenData?.totalFeePRVText ?? '',
        hasQuestionIcon: true,
        onPressQuestionIcon: () => null,
        boldLabel: true,
      });
    } else {
      result.push(
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
      );
    }
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
0;
