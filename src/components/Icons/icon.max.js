import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import PropTypes from 'prop-types';
import {COLORS, FONT} from '@src/styles';

const styled = StyleSheet.create({
  label: {
    ...FONT.STYLE.normal,
    color: COLORS.lightGrey35,
    fontSize: FONT.SIZE.regular
  }
});

const MaxIcon = React.memo(({ onPress, color, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[style]}>
      <Text style={[styled.label, { color: color }]}>MAX</Text>
    </TouchableOpacity>
  );
});

MaxIcon.defaultProps = {
  color: COLORS.lightGrey35,
  style: { marginLeft: 14 }
};

MaxIcon.propTypes = {
  color: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.any
};

export default MaxIcon;
