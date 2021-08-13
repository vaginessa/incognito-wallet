import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import TradeInputAmount from '@src/components/core/TradeInputAmount';
import createField from './createField';

const styled = StyleSheet.create({});

const renderCustomField = (props) => {
  const { input, ...rest } = props;
  const { onChange, ...restInput } = input;
  return (
    <TradeInputAmount
      {...{ ...rest, ...restInput, onChangeText: (text) => onChange(text) }}
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
