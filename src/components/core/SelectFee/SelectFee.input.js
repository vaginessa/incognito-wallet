import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { BaseTextInput } from '@src/components/core';
import { Row } from '@src/components';
import { COLORS, FONT } from '@src/styles';
import SelectFee from './SelectFee';

const styled = StyleSheet.create({
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    flex: 1,
    maxWidth: '50%',
  },
  input: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    color: COLORS.black,
  },
});

const SelectFeeInput = (props) => {
  const { types, onChangeTypeFee, placeholder, ...rest } = props;
  return (
    <Row style={styled.inputContainer}>
      <View style={styled.inputWrapper}>
        <BaseTextInput
          style={styled.input}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          ellipsizeMode="tail"
          numberOfLines={1}
          {...rest}
        />
      </View>
      <SelectFee types={types} onChangeTypeFee={onChangeTypeFee} />
    </Row>
  );
};

SelectFeeInput.propTypes = {
  onChangeTypeFee: PropTypes.func.isRequired,
  types: PropTypes.arrayOf(
    PropTypes.shape({
      tokenId: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
      actived: PropTypes.bool.isRequired,
    }),
  ).isRequired,
};

export default React.memo(SelectFeeInput);
