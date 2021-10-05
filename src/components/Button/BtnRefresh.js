import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import srcRefreshIcon from '@src/assets/images/new-icons/refresh.png';
import PropTypes from 'prop-types';
import { COLORS } from '@src/styles';

const styled = StyleSheet.create({
  container: {},
  icon: {
    width: 24,
    height: 24,
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
