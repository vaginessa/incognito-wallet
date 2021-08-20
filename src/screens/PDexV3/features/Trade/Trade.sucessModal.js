import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Text } from '@src/components/core';
import { ButtonTrade } from '@src/components/Button';
import { COLORS, FONT } from '@src/styles';
import { useDispatch } from 'react-redux';
import { actionToggleModal } from '@src/components/Modal';
import { PureModalContent } from '@src/components/Modal/features/PureModal';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';

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

const TradeSucessModal = (props) => {
  const { desc, btnColor = COLORS.colorTradeBlue } = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const handleKeepTrading = () => {
    dispatch(actionToggleModal({ visible: false, data: null }));
    navigation.navigate(routeNames.Trade);
  };
  return (
    <PureModalContent>
      <Text style={styled.title}>Trade initiated!</Text>
      <Text style={styled.desc}>{desc}</Text>
      <Text style={styled.sub}>
        Your balance will update in a couple of minutes after the trade is
        finalized.
      </Text>
      <ButtonTrade
        btnStyle={{ backgroundColor: btnColor }}
        title="Keep trading"
        onPress={handleKeepTrading}
      />
    </PureModalContent>
  );
};

TradeSucessModal.propTypes = {
  desc: PropTypes.string.isRequired,
  btnColor: PropTypes.string.isRequired,
};

export default React.memo(TradeSucessModal);
