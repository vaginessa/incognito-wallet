import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { TouchableOpacity, Divider } from '@components/core';
import CircleArrowDownIcon from '@src/components/Icons/CircleArrowDown';
import Row from '@src/components/Row';

const styled = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 15,
  },
});

const SwapButton = ({ onSwapButtons, style }) => (
  <Row style={[styled.container, style]}>
    <Divider />
    <TouchableOpacity onPress={onSwapButtons}>
      <CircleArrowDownIcon />
    </TouchableOpacity>
    <Divider />
  </Row>
);

SwapButton.propTypes = {
  onSwapButtons: PropTypes.func.isRequired,
  style: PropTypes.any,
};

export default React.memo(SwapButton);
