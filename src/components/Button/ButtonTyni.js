import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacityProps } from 'react-native';
import { FONT } from '@src/styles';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme';
import { TouchableOpacity, Text } from '@components/core';

const styled = StyleSheet.create({
  containerStyle: {
    height: 24,
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 24,
  },
  titleStyle: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
  },
});

const ButtonTyni = (props: TouchableOpacityProps) => {
  const { containerStyle, btnStyle, titleStyle, title, style, ...rest } = props;
  const colors = useSelector(colorsSelector);
  return (
    <TouchableOpacity
      style={[
        styled.containerStyle,
        { backgroundColor: colors.secondary },
        style,
      ]}
      {...rest}
    >
      <Text style={styled.titleStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

ButtonTyni.propTypes = {
  containerStyle: PropTypes.any,
  btnStyle: PropTypes.any,
  titleStyle: PropTypes.any,
  title: PropTypes.string.isRequired,
};

export default React.memo(ButtonTyni);
