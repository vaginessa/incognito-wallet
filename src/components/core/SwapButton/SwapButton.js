import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Divider } from 'react-native-elements';
import { TouchableOpacity } from '@components/core';
import CircleArrowDownIcon from '@src/components/Icons/CircleArrowDown';
import Row from '@src/components/Row';
import { COLORS } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey18,
  },
});

const SwapButton = ({ onSwapButtons, style }) => (
  <Row style={[styled.container, style]}>
    <Divider style={styled.divider} />
    <TouchableOpacity onPress={onSwapButtons}>
      <CircleArrowDownIcon />
    </TouchableOpacity>
    <Divider style={styled.divider} />
  </Row>
);

SwapButton.propTypes = {
  onSwapButtons: PropTypes.func.isRequired,
  style: PropTypes.any,
};

export default memo(SwapButton);
