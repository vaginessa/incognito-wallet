import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@src/components/core';
import { actionToggleModal } from '@src/components/Modal';
import { TradeSuccessModal } from '@screens/PDexV3/features/Trade';
import { Hook, styled as extraStyled } from '@screens/PDexV3/features/Extra';
import { actionInitSwapForm, actionReset } from './Swap.actions';
import { slippagetoleranceSelector, swapInfoSelector } from './Swap.selector';

const enhance = (WrappedComp) => (props) => {
  const navigation = useNavigation();
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
  const handleConfirmSwap = async () => {
    try {
      //   const tradeSuccess = await dispatch(actionFetch());
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
  const handleReviewOrder = () =>
    !swapInfo?.disabledBtnSwap &&
    navigation.navigate(routeNames.ReviewOrder, {
      data: {
        extra: (
          <>
            <Text style={extraStyled.specialTitle}>
              Buy at least {swapInfo?.buyInputAmountStr || ''}
            </Text>
            {hooksFactories.map((hook) => (
              <Hook key={hook.label} {...hook} />
            ))}
          </>
        ),
        handleConfirm: handleConfirmSwap,
      },
    });
  const initSwapForm = React.useCallback(() => {
    dispatch(actionInitSwapForm());
  }, []);
  React.useEffect(() => {
    initSwapForm();
    return () => {
      dispatch(actionReset());
    };
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleReviewOrder }} />
    </ErrorBoundary>
  );
};

export default enhance;
