import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import srcRefreshIcon from '@src/assets/images/icons/refresh_icon.png';
import PropTypes from 'prop-types';
import { COLORS } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    backgroundColor: COLORS.colorGreyLight1,
    width: 56,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  icon: {
    width: 21,
    height: 23,
  },
});

const BtnChart = (props) => {
  const { style, ...rest } = props;
  return (
    <TouchableOpacity style={[styled.container, style]} {...rest}>
      <Image source={srcRefreshIcon} style={styled.icon} />
    </TouchableOpacity>
  );
};

BtnChart.defaultProps = {};

BtnChart.propTypes = {};

export default BtnChart;
