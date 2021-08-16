import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '@src/components/core';
import { ButtonTrade } from '@src/components/Button';
import { COLORS, FONT } from '@src/styles';
import { useDispatch, useSelector } from 'react-redux';
import { actionToggleModal } from '@src/components/Modal';
import { PureModalContent } from '@src/components/Modal/features/PureModal';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { swapInfoSelector } from './Swap.selector';

const styled = StyleSheet.create({
  title: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 15,
  },
  desc: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 5,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 10,
  },
  sub: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
    color: COLORS.newGrey,
    textAlign: 'center',
    marginBottom: 30,
  },
});

const SwapSucessModal = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const swapInfo = useSelector(swapInfoSelector);
  const handleKeepTrading = () => {
    dispatch(actionToggleModal({ visible: false, data: null }));
    navigation.navigate(routeNames.Trade);
  };
  return (
    <PureModalContent>
      <Text style={styled.title}>Trade initiated!</Text>
      <Text style={styled.desc}>
        {`You placed an order to sell 
        ${swapInfo?.sellInputAmountStr ||
          ''} for ${swapInfo?.buyInputAmountStr || ''}.`}
      </Text>
      <Text style={styled.sub}>
        Your balance will update in a couple of minutes after the trade is
        finalized.
      </Text>
      <ButtonTrade title="Keep trading" onPress={handleKeepTrading} />
    </PureModalContent>
  );
};

SwapSucessModal.propTypes = {};

export default React.memo(SwapSucessModal);
