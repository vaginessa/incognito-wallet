import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  container: {},
});

const OpenOrders = (props) => {
  return <View style={styled.container} />;
};

OpenOrders.propTypes = {};

export default React.memo(OpenOrders);
