import {
  ArrowRightGreyIcon,
  ArrowRightPrimaryIcon,
  InfiniteIcon,
} from '@src/components/Icons';
import Row from '@src/components/Row';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@src/components/core';
import { COLORS, FONT } from '@src/styles';
import BaseTextInput from '../BaseTextInput';
import TouchableOpacity from '../TouchableOpacity';

const styled = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  input: {
    width: '100%',
    color: COLORS.black,
    fontSize: FONT.SIZE.large + 2,
    lineHeight: FONT.SIZE.large + 5,
    fontFamily: FONT.NAME.bold,
  },
  symbol: {
    color: COLORS.black,
    fontSize: FONT.SIZE.large + 2,
    lineHeight: FONT.SIZE.large + 5,
    fontFamily: FONT.NAME.bold,
    marginRight: 10,
  },
  infinityIcon: {
    marginRight: 10,
  },
});

const TradeInputAmount = (props) => {
  const {
    hasInfinityIcon = false,
    onPressInfinityIcon,
    symbol,
    canSelectSymbol,
    onPressSymbol,
    placeholder = '0',
  } = props || {};
  return (
    <Row style={styled.container}>
      <View style={styled.inputContainer}>
        <BaseTextInput
          style={styled.input}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          ellipsizeMode="tail"
          numberOfLines={1}
        />
      </View>
      {hasInfinityIcon && (
        <TouchableOpacity
          onPress={onPressInfinityIcon}
          style={styled.infinityIcon}
        >
          <InfiniteIcon />
        </TouchableOpacity>
      )}
      {canSelectSymbol && (
        <TouchableOpacity onPress={onPressSymbol}>
          <Row style={{ alignItems: 'center' }}>
            {symbol && <Text style={styled.symbol}>{symbol}</Text>}
            <ArrowRightGreyIcon />
          </Row>
        </TouchableOpacity>
      )}
    </Row>
  );
};

TradeInputAmount.propTypes = {};

export default React.memo(TradeInputAmount);
