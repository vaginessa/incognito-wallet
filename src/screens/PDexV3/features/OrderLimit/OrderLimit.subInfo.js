import React from 'react';
import { View, StyleSheet } from 'react-native';
import isEmpty from 'lodash/isEmpty';
import Extra, { Hook } from '@screens/PDexV3/features/Extra';
import { RFSelectFeeInput, validator } from '@src/components/core/reduxForm';
import { Field } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
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
import { actionEstimateTrade, actionSetFeeToken } from './OrderLimit.actions';

const styled = StyleSheet.create({
  container: {},
});

const SubInfo = () => {
  const dispatch = useDispatch();
  const orderLimitData = useSelector(orderLimitDataSelector);
  const inputAmount = useSelector(inputAmountSelector);
  const sellinputAmount = inputAmount(formConfigs.selltoken);
  const feetokenData = useSelector(feetokenDataSelector);
  const feeTypes = useSelector(feeTypesSelector);
  const prv: SelectedPrivacy = useSelector(getPrivacyDataByTokenID)(PRV.id);
  const onChangeTypeFee = async (type) => {
    const { tokenId } = type;
    await dispatch(actionSetFeeToken(tokenId));
    dispatch(actionEstimateTrade());
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
          editableInput={!!orderLimitData?.editableInput}
        />
      ),
    },
    {
      title: 'Trade details',
      hooks: [
        {
          label: 'Balance',
          value: orderLimitData?.balanceStr ?? '',
        },
        orderLimitData?.showPRVBalance
          ? {
            label: 'PRV Balance',
            value: orderLimitData?.prvBalanceStr ?? '',
          }
          : {},
        {
          label: 'Network fee',
          value: orderLimitData?.networkfeeAmountStr ?? '',
        },
        {
          label: 'Incognito',
          value: orderLimitData?.poolSizeStr ?? '',
          boldLabel: true,
          hasQuestionIcon: true,
          onPressQuestionIcon: () => null,
        },
      ]
        .filter((hook) => !isEmpty(hook))
        .map((hook, index) => <Hook {...hook} key={hook.label + index} />),
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
