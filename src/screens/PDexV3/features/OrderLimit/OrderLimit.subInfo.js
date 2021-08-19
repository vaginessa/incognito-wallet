import React from 'react';
import { View, StyleSheet } from 'react-native';
import Extra, { Hook } from '@screens/PDexV3/features/Extra';
import { RFSelectFeeInput, validator } from '@src/components/core/reduxForm';
import { Field } from 'redux-form';
import { useSelector } from 'react-redux';
import { getPrivacyDataByTokenID } from '@src/redux/selectors/selectedPrivacy';
import { PRV } from '@src/constants/common';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { formConfigs } from './OrderLimit.constant';
import {
  feetokenDataSelector,
  feeTypesSelector,
  inputAmountSelector,
  orderLimitDataSelector,
} from './OrderLimit.selector';
import {
  availablePayFeeByPRVValidator,
  minFeeValidator,
} from './OrderLimit.utils';

const styled = StyleSheet.create({
  container: {},
});

const SubInfo = (props) => {
  const orderLimitData = useSelector(orderLimitDataSelector);
  const inputAmount = useSelector(inputAmountSelector);
  const sellinputAmount = inputAmount(formConfigs.selltoken);
  const feetokenData = useSelector(feetokenDataSelector);
  const feeTypes = useSelector(feeTypesSelector);
  const prv: SelectedPrivacy = useSelector(getPrivacyDataByTokenID)(PRV.id);
  const onChangeTypeFee = (feeType) => {
    console.log('onChangeTypeFee', feeType);
  };
  let _minFeeValidator = React.useCallback(
    () => minFeeValidator(feetokenData),
    [
      feetokenData?.origininalFeeAmount,
      feetokenData?.minFeeOriginal,
      feetokenData?.symbol,
      feetokenData?.minFeeAmountText,
    ],
  );
  let _availablePayFeeByPRVValidator = React.useCallback(
    () =>
      availablePayFeeByPRVValidator({
        prvBalance: prv?.amount || 0,
        usingFeeBySellToken: sellinputAmount?.usingFee,
        origininalFeeAmount: feetokenData?.origininalFeeAmount,
        networkfee: orderLimitData?.networkfee,
      }),
    [
      sellinputAmount?.usingFee,
      prv?.amount,
      feetokenData?.origininalFeeAmount,
      orderLimitData?.networkfee,
    ],
  );
  const extraFactories = [
    {
      title: 'Trading fee',
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
      hooks: (
        <Field
          component={RFSelectFeeInput}
          types={feeTypes}
          onChangeTypeFee={onChangeTypeFee}
          name={formConfigs.feetoken}
          placeholder="0"
          validate={[
            ...validator.combinedAmount,
            _minFeeValidator,
            _availablePayFeeByPRVValidator,
          ]}
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
