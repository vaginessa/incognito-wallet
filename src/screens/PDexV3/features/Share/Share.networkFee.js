import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '@src/components/core';
import { COLORS, FONT } from '@src/styles';

const styled = StyleSheet.create({
  subText: {
    fontSize: FONT.SIZE.superSmall,
    fontFamily: FONT.NAME.regular,
    color: COLORS.colorGrey3,
    textAlign: 'center',
  },
});

const NetworkFee = () => {
  return (
    <Text style={styled.subText}>
      {
        'Incognito collects a small network fee of PRV to pay the miners\nwho help power the network.'
      }
    </Text>
  );
};

NetworkFee.propTypes = {};

export default React.memo(NetworkFee);
