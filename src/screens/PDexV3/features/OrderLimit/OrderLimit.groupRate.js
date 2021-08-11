import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { BaseTextInput, Text } from '@src/components/core';
import { Row } from '@src/components';
import { COLORS, FONT } from '@src/styles';
import { Hook } from '../Extra';

const styled = StyleSheet.create({
  container: {},
  ctRateContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctRateLabel: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    color: COLORS.newGrey,
    flex: 1,
    maxWidth: '30%',
  },
  ctRateInput: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    color: COLORS.black,
    width: '100%',
    textAlign: 'right',
  },
  ctRateInputContainer: {
    alignItems: 'center',
    maxWidth: '60%',
    justifyContent: 'space-between',
  },
  ctRateInputUnit: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    color: COLORS.black,
    textAlign: 'right',
  },
  crRateInputWrapper: {
    flex: 1,
    marginRight: 10,
  },
});

const Rate = React.memo(() => {
  return (
    <Hook
      label="Rate"
      value="1 PRV = 0.5 XMR"
      hasQuestionIcon
      onPressQuestionIcon={() => null}
      boldLabel
    />
  );
});

const CustomRate = React.memo(() => {
  return (
    <Row style={styled.ctRateContainer}>
      <Text style={styled.ctRateLabel} numberOfLines={1} ellipsizeMode="tail">
        1 PRV =
      </Text>
      <Row style={styled.ctRateInputContainer}>
        <View style={styled.crRateInputWrapper}>
          <BaseTextInput
            style={styled.ctRateInput}
            keyboardType="decimal-pad"
            placeholder="0.5"
            ellipsizeMode="tail"
            numberOfLines={1}
          />
        </View>
        <Text style={styled.ctRateInputUnit}>XMR</Text>
      </Row>
    </Row>
  );
});

const GroupRate = (props) => {
  return (
    <View style={styled.container}>
      <Rate />
      <CustomRate />
    </View>
  );
};

GroupRate.propTypes = {};

export default React.memo(GroupRate);
