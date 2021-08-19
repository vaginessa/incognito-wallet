import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import BaseTextInput from '@src/components/core/BaseTextInput';
import Row from '@src/components/Row';
import { COLORS, FONT } from '@src/styles';
import createField from './createField';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    color: COLORS.black,
  },
});

const renderCustomField = (props) => {
  const { input, rightCustom, inputStyle, ...rest } = props;
  const { onChange, onFocus, onBlur, ...restInput } = input;
  return (
    <Row style={styled.container}>
      <BaseTextInput
        {...{
          ...rest,
          ...restInput,
          style: {
            ...styled.input,
            ...inputStyle,
          },
          onChangeText: (text) => onChange(text),
          onFocus: (event) => onFocus(event),
          onBlur: (event) => onBlur(event),
        }}
      />
      {rightCustom && rightCustom}
    </Row>
  );
};

const RFBaseInput = createField({
  fieldName: 'RFBaseInput',
  render: renderCustomField,
});

renderCustomField.defaultProps = {};

renderCustomField.propTypes = {
  rightCustom: PropTypes.any,
};

export default React.memo(RFBaseInput);
