import React from 'react';
import { StyleSheet } from 'react-native';
import TradeInputAmount from '@src/components/core/TradeInputAmount';
import createField from './createField';

const styled = StyleSheet.create({});

const renderCustomField = (props) => {
  const { input, onChangeTextCustom, ...rest } = props;
  const { onChange, onFocus, onBlur, ...restInput } = input;
  return (
    <TradeInputAmount
      {...{
        ...rest,
        ...restInput,
        onChangeText: (text) => {
          onChange(text);
        },
        onFocus: (event) => onFocus(event),
        onBlur: (event) => onBlur(event),
      }}
    />
  );
};

const RFTradeInputAmount = createField({
  fieldName: 'RFTradeInputAmount',
  render: renderCustomField,
});

renderCustomField.defaultProps = {};

renderCustomField.propTypes = {};

export default React.memo(RFTradeInputAmount);
