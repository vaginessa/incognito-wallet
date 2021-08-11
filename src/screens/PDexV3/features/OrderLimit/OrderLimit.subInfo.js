import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { BaseTextInput, Text } from '@src/components/core';
import { Row } from '@src/components';
import { COLORS, FONT } from '@src/styles';
import SelectFee from '@screens/PDexV3/features/SelectFee';
import Extra, {
  Hook,
  styled as extraStyled,
} from '@screens/PDexV3/features/Extra';

const styled = StyleSheet.create({
  container: {},
  ctRateInput: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    color: COLORS.black,
  },
  ctRateInputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  crRateInputWrapper: {
    flex: 1,
    maxWidth: '50%',
  },
});

const SubInfo = (props) => {
  const onChangeTypeFee = (feeType) => {
    console.log('onChangeTypeFee', feeType);
  };
  const extraFactories = [
    {
      title: 'Trading fee',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
      hooks: (
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
          <SelectFee
            types={[
              {
                tokenId: '004',
                symbol: 'PRV',
              },
              {
                tokenId: '378',
                symbol: 'XMR',
              },
            ]}
            onChangeTypeFee={onChangeTypeFee}
          />
        </Row>
      ),
    },
    {
      title: 'Trade details',
      hooks: [
        {
          label: 'Balance',
          value: '1000 PRV',
        },
        {
          label: 'Balance',
          value: '2000 XMR',
        },
        {
          label: 'Network fee',
          value: '0.000001 PRV',
        },
        {
          label: 'Incognito',
          value: '1984981 USDC + 9849141 PRV',
          boldLabel: true,
          hasQuestionIcon: true,
          onPressQuestionIcon: () => null,
        },
      ].map((hook, index) => <Hook {...hook} key={hook.label + index} />),
    },
  ];
  return (
    <View style={styled.container}>
      {extraFactories.map((extra) => (
        <Extra {...extra} key={extra.label} />
      ))}
    </View>
  );
};

SubInfo.propTypes = {};

export default React.memo(SubInfo);
