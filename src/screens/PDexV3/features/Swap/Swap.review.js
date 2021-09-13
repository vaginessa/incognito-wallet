import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ReviewOrder, TradeSuccessModal } from '@screens/PDexV3/features/Trade';
import { useDispatch, useSelector } from 'react-redux';
import LoadingTx from '@src/components/LoadingTx';
import { actionToggleModal } from '@src/components/Modal';
import { Hook, styled as extraStyled } from '@screens/PDexV3/features/Extra';
import { Text } from '@src/components/core';
import { actionFetchSwap } from './Swap.actions';
import { swapInfoSelector, slippagetoleranceSelector } from './Swap.selector';

const Review = (props) => {
  const dispatch = useDispatch();
  const swapInfo = useSelector(swapInfoSelector);
  const slippagetolerance = useSelector(slippagetoleranceSelector);
  const hooksFactories = [
    {
      label: 'Pay with',
      value: swapInfo?.sellInputAmountStr || '',
      boldLabel: true,
      boldValue: true,
    },
    {
      label: 'Routing',
      value: swapInfo?.routing || '',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
    },
    {
      label: 'Slippage tolerance',
      value: slippagetolerance || '',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
    },
    {
      label: 'Trading fee',
      value: swapInfo?.tradingFeeStr || '',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
    },
    {
      label: 'Network fee',
      value: swapInfo?.networkfeeAmountStr || '',
    },
  ];

  const handleConfirm = async () => {
    try {
      const tx = await dispatch(actionFetchSwap());
      dispatch(
        actionToggleModal({
          data: (
            <TradeSuccessModal
              desc={`You placed an order to sell 
              ${swapInfo?.sellInputAmountStr ||
                ''} for ${swapInfo?.buyInputAmountStr || ''}.`}
            />
          ),
          visible: true,
        }),
      );
    } catch {
      //
    }
  };

  return (
    <ReviewOrder
      extra={
        <View>
          <Text style={extraStyled.specialTitle}>
            Buy at least {swapInfo?.buyInputAmountStr || ''}
          </Text>
          {hooksFactories.map((hook) => (
            <Hook key={hook.label} {...hook} />
          ))}
          {swapInfo?.swaping && <LoadingTx />}
        </View>
      }
      handleConfirm={handleConfirm}
    />
  );
};

Review.propTypes = {};

export default React.memo(Review);
