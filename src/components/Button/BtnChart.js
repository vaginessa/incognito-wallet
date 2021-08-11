import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import srcChartIcon from '@src/assets/images/icons/chart_icon.png';
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
    width: 26,
    height: 20,
  },
});

const BtnChart = (props) => {
  const { style, ...rest } = props;
  return (
    <TouchableOpacity style={[styled.container, style]} {...rest}>
      <Image source={srcChartIcon} style={styled.icon} />
    </TouchableOpacity>
  );
};

BtnChart.defaultProps = {};

BtnChart.propTypes = {};

export default BtnChart;
