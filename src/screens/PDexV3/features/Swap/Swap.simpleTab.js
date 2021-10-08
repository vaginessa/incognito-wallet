import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Hook } from '@screens/PDexV3/features/Extra';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { ButtonTrade } from '@src/components/Button';
import {
  feetokenDataSelector,
  swapInfoSelector,
  slippagetoleranceSelector,
  inputAmountSelector,
} from './Swap.selector';
import { MaxPriceAndImpact } from './Swap.shared';
import { formConfigs } from './Swap.constant';
import SwapInputsGroup from './Swap.inputsGroup';

const styled = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  hookWrapper: {
    marginTop: 40,
  },
  btnTrade: {
    marginTop: 24,
    height: 50,
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
    if (sellInputAmount?.isMainCrypto && sellInputAmount.usingFee) {
      result.push({
        label: 'Trading fee',
        value: feeTokenData?.totalFeePRVText ?? '',
        hasQuestionIcon: true,
        onPressQuestionIcon: () => null,
      });
    } else {
      result.push(
        {
          label: 'Trading fee',
          value: feeTokenData?.feeAmountText ?? '',
          hasQuestionIcon: true,
          onPressQuestionIcon: () => null,
        },
        {
          label: 'Network fee',
          value: swapInfo?.networkfeeAmountStr ?? '',
          hasQuestionIcon: true,
          onPressQuestionIcon: () => null,
        },
      );
    }
    return result.filter((hook) => !isEmpty(hook));
  }, [swapInfo]);
  return {
    hooksFactories,
  };
};

const TabSimple = React.memo(({ handleConfirm }) => {
  const { hooksFactories } = useTabFactories();
  const swapInfo = useSelector(swapInfoSelector);
  return (
    <View style={styled.container}>
      <SwapInputsGroup />
      <ButtonTrade
        btnStyle={styled.btnTrade}
        onPress={handleConfirm}
        title={swapInfo?.btnSwapText || ''}
        disabled={!!swapInfo?.disabledBtnSwap}
      />
      <View style={styled.hookWrapper}>
        {hooksFactories.map((item) => (
          <Hook {...item} key={item.label} />
        ))}
      </View>
    </View>
  );
});

export default React.memo(TabSimple);
0;
