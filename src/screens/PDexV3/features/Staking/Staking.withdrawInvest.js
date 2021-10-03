import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header} from '@src/components';
import {
  formConfigsWithdrawInvest,
  STAKING_MESSAGES
} from '@screens/PDexV3/features/Staking/Staking.constant';
import {createForm, RFTradeInputAmount as TradeInputAmount, validator} from '@components/core/reduxForm';
import {coinStyles as coinStyled} from '@screens/PDexV3/features/Staking/Staking.styled';
import {useDispatch, useSelector} from 'react-redux';
import {Text} from '@components/core';
import {change, Field} from 'redux-form';
import withInput from '@screens/PDexV3/features/Staking/Staking.enhanceInput';
import {stakingSelector} from '@screens/PDexV3/features/Staking/index';
import {BTNPrimary} from '@components/core/Button';

const initialFormValues = {
  input: ''
};

const Form = createForm(formConfigsWithdrawInvest.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const Input = React.memo(({ onWithdrawMaxInvest }) => {
  const dispatch = useDispatch();
  const inputValidate = useSelector(stakingSelector.withdrawInvestValidate);
  const { withdrawInvest, token } = useSelector(stakingSelector.withdrawInvestCoinSelector);

  const onChangeText = (text) => dispatch(change(formConfigsWithdrawInvest.formName, formConfigsWithdrawInvest.input, text));
  const onChangeWithdrawMax = () => withdrawInvest && onWithdrawMaxInvest(withdrawInvest.maxWithdrawAmountStr);
  return(
    <>
      <Text style={coinStyled.smallGray}>
        {`Amount: ${withdrawInvest.maxWithdrawAmountSymbolStr}`}
      </Text>
      <Field
        component={TradeInputAmount}
        name={formConfigsWithdrawInvest.input}
        hasInfinityIcon
        validate={[
          ...validator.combinedAmount,
          inputValidate,
        ]}
        onChange={onChangeText}
        editableInput
        onPressInfinityIcon={onChangeWithdrawMax}
        wrapInputStyle={coinStyled.wrapInput}
        inputStyle={coinStyled.input}
        symbolStyle={coinStyled.symbol}
        infiniteStyle={coinStyled.infinite}
        symbol={token && token?.symbol}
      />
    </>
  );
});

const CustomInput = withInput(Input);

const StakingWithdrawInvest = () => {
  const disabled = useSelector(stakingSelector.withdrawInvestDisable);
  // const navigateConfirm = () => navigation.navigate(routeNames.StakingMoreConfirm);
  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.withdraw} />
      <View style={coinStyled.coinContainer}>
        <Form>
          {() => (<CustomInput />)}
        </Form>
        <BTNPrimary
          title={STAKING_MESSAGES.withdraw}
          wrapperStyle={coinStyled.button}
          disabled={disabled}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

Input.propTypes = {
  onWithdrawMaxInvest: PropTypes.func.isRequired
};

export default React.memo(StakingWithdrawInvest);
