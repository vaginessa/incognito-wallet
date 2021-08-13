import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Extra, {
  Hook,
  styled as extraStyled,
} from '@screens/PDexV3/features/Extra';
import { SelectFeeInput } from '@src/components/core/SelectFee';

const styled = StyleSheet.create({
  container: {},
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
        <SelectFeeInput
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
