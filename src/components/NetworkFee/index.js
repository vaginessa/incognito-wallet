import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Text } from '@src/components/core';
import { COLORS, FONT } from '@src/styles';
import { useFaucet } from '@src/components/Modal/features/FaucetPRVModal';

const styled = StyleSheet.create({
  subText: {
    fontSize: FONT.SIZE.superSmall,
    fontFamily: FONT.NAME.regular,
    color: COLORS.colorGrey3,
    textAlign: 'center',
  },
  topup: {
    fontSize: FONT.SIZE.superSmall,
    fontFamily: FONT.NAME.medium,
    color: COLORS.black,
    textDecorationLine: 'underline',
  },
});

const NetworkFee = ({ style }) => {
  const [navigateFaucet] = useFaucet();
  return (
    <Text style={[styled.subText, style]}>
      {
        'Incognito collects a small network fee of PRV to pay the miners\nwho help power the network.'
      }
      <Text style={styled.topup} onPress={navigateFaucet}>
        Top up now!
      </Text>
    </Text>
  );
};

NetworkFee.propTypes = {
  style: PropTypes.object,
};

export default React.memo(NetworkFee);
