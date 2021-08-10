import { Header } from '@src/components';
import { ButtonTrade } from '@src/components/Button';
import { ScrollView, Text } from '@src/components/core';
import { withLayout_2 } from '@src/components/Layout';
import routeNames from '@src/router/routeNames';
import { COLORS, FONT } from '@src/styles';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { useDispatch } from 'react-redux';
import { actionToggleModal } from '@src/components/Modal';
import Extra, {
  Hook,
  styled as extraStyled,
} from '@screens/PDexV3/features/Extra';
import { actionFetch } from './Swap.actions';
import SwapSuccessModal from './Swap.successModal';

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
      value: '100.00 USDC',
      boldLabel: true,
      boldValue: true,
    },
    {
      label: 'Rate',
      value: '1 USDC = 1.98 PRV',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
    },
    {
      label: 'Purchase',
      value: '99.97 USDC',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
    },
    {
      label: 'Trading fee',
      value: '0.03 USDC',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
    },
    {
      label: 'Network fee',
      value: '0.01 PRV',
    },
  ];
  return (
    <View style={styled.container}>
      <Header title="Order preview" />
      <ScrollView style={styled.scrollview}>
        <Text style={styled.title}>Buy at least 198 PRV</Text>
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
