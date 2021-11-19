import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, FONT } from '@src/styles';

const styled = StyleSheet.create({
  btnMax: {
    fontSize: FONT.SIZE.regular,
    fontFamily: FONT.NAME.medium,
    color: COLORS.colorGrey3,
  },
});

const MaxIcon = React.memo(({ onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Text style={styled.btnMax}>MAX</Text>
    </TouchableOpacity>
  );
});

MaxIcon.defaultProps = {};

MaxIcon.propTypes = {
  color: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.any,
};

export default MaxIcon;
