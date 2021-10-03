import { ArrowRightGreyIcon, InfiniteIcon } from '@src/components/Icons';
import PropTypes from 'prop-types';
import Row from '@src/components/Row';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@src/components/core';
import { COLORS, FONT } from '@src/styles';
import BaseTextInput from '../BaseTextInput';
import TouchableOpacity from '../TouchableOpacity';
import ActivityIndicator from '../ActivityIndicator';

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
  loadingIcon: {
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
    loadingBalance,
    editableInput,
    wrapInputStyle,
    symbolStyle,
    inputStyle,
    infiniteStyle,
    ...rest
  } = props || {};
  const renderSub = () => {
    if (loadingBalance) {
      return <ActivityIndicator style={styled.loadingIcon} size="small" />;
    }
    if (hasInfinityIcon) {
      return (
        <TouchableOpacity
          onPress={() =>
            typeof onPressInfinityIcon === 'function' && onPressInfinityIcon()
          }
          style={styled.infinityIcon}
        >
          <InfiniteIcon style={infiniteStyle} />
        </TouchableOpacity>
      );
    }
  };
  return (
    <Row style={[styled.container, wrapInputStyle]}>
      <View style={styled.inputContainer}>
        <BaseTextInput
          style={{
            ...styled.input,
            ...inputStyle
          }}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          ellipsizeMode="tail"
          numberOfLines={1}
          editable={editableInput}
          {...rest}
        />
      </View>
      {renderSub()}
      {!!symbol && (
        <TouchableOpacity onPress={onPressSymbol}>
          <Row style={{ alignItems: 'center' }}>
            {!!symbol && <Text style={[styled.symbol, symbolStyle]}>{symbol}</Text>}
            {canSelectSymbol && <ArrowRightGreyIcon />}
          </Row>
        </TouchableOpacity>
      )}
    </Row>
  );
};

TradeInputAmount.defaultProps = {
  hasInfinityIcon: false,
  onPressInfinityIcon: undefined,
  symbol: undefined,
  canSelectSymbol: false,
  onPressSymbol: undefined,
  loadingBalance: false,
  editableInput: false,
  wrapInputStyle: {},
  symbolStyle: {},
  inputStyle: {},
  infiniteStyle: {}
};

TradeInputAmount.propTypes = {
  hasInfinityIcon: PropTypes.bool,
  onPressInfinityIcon: PropTypes.func,
  symbol: PropTypes.string,
  canSelectSymbol: PropTypes.bool,
  onPressSymbol: PropTypes.func,
  loadingBalance: PropTypes.bool,
  editableInput: PropTypes.bool,
  wrapInputStyle: PropTypes.any,
  symbolStyle: PropTypes.any,
  inputStyle: PropTypes.any,
  infiniteStyle: PropTypes.any,
};

export default React.memo(TradeInputAmount);
