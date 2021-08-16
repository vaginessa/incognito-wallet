import { Header } from '@src/components';
import { ButtonTrade } from '@src/components/Button';
import { ScrollView, Text } from '@src/components/core';
import { withLayout_2 } from '@src/components/Layout';
import routeNames from '@src/router/routeNames';
import { COLORS, FONT } from '@src/styles';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { actionToggleModal } from '@src/components/Modal';
import Extra, {
  Hook,
  styled as extraStyled,
} from '@screens/PDexV3/features/Extra';
import SwapSuccessModal from './Swap.successModal';
import { slippagetoleranceSelector, swapInfoSelector } from './Swap.selector';

const styled = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: FONT.SIZE.superLarge,
    lineHeight: FONT.SIZE.superLarge + 5,
    color: COLORS.colorTradeBlue,
    fontFamily: FONT.NAME.bold,
    marginBottom: 30,
  },
  btnStyled: {
    marginTop: 30,
  },
  scrollview: {
    paddingTop: 42,
    flex: 1,
  },
});

const ReviewOrder = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const swapInfo = useSelector(swapInfoSelector);
  const slippagetolerance = useSelector(slippagetoleranceSelector);
  const handleConfirmSwap = async () => {
    try {
      //   const tradeSuccess = await dispatch(actionFetch());
      dispatch(
        actionToggleModal({
          data: <SwapSuccessModal />,
          visible: true,
        }),
      );
    } catch {
      //
    }
  };
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
  return (
    <View style={styled.container}>
      <Header title="Order preview" />
      <ScrollView style={styled.scrollview}>
        <Text style={styled.title}>
          Buy at least {swapInfo?.buyInputAmountStr || ''}
        </Text>
        {hooksFactories.map((hook) => (
          <Hook key={hook.label} {...hook} />
        ))}
        <ButtonTrade
          btnStyle={styled.btnStyled}
          title="Confirm"
          onPress={handleConfirmSwap}
        />
      </ScrollView>
    </View>
  );
};

ReviewOrder.propTypes = {};

export default withLayout_2(React.memo(ReviewOrder));
