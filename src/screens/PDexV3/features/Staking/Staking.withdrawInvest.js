import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header, LoadingContainer, RowSpaceText} from '@src/components';
import {
  formConfigsWithdrawInvest,
  STAKING_MESSAGES
} from '@screens/PDexV3/features/Staking/Staking.constant';
import {createForm, RFTradeInputAmount as TradeInputAmount, validator} from '@components/core/reduxForm';
import {coinStyles as coinStyled} from '@screens/PDexV3/features/Staking/Staking.styled';
import {useDispatch, useSelector} from 'react-redux';
import {
  stakingFeeSelector,
  withdrawInvestCoinSelector,
  withdrawInvestDisable, withdrawInvestInputAmount,
  withdrawInvestValidate
} from '@screens/PDexV3/features/Staking/Staking.selector';
import {useNavigation} from 'react-navigation-hooks';
import {RoundCornerButton} from '@components/core';
import {change, Field} from 'redux-form';
import routeNames from '@routers/routeNames';
import withInput from '@screens/PDexV3/features/Staking/Staking.enhanceInput';

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
  const inputValidate = useSelector(withdrawInvestValidate);
  const { maxDepositText } = useSelector(withdrawInvestInputAmount);
  const onChangeText = (text) => dispatch(change(formConfigsWithdrawInvest.formName, formConfigsWithdrawInvest.input, text));
  const onChangeWithdrawMax = () => onWithdrawMaxInvest(maxDepositText);
  React.useEffect(() => { onChangeWithdrawMax(); }, []);
  return(
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
    />
  );
});

const CustomInput = withInput(Input);

const StakingWithdrawInvest = () => {
  const navigation = useNavigation();
  const coin = useSelector(withdrawInvestCoinSelector);
  const fee = useSelector(stakingFeeSelector);
  const disabled = useSelector(withdrawInvestDisable);
  const navigateConfirm = () => navigation.navigate(routeNames.StakingMoreConfirm);
  const renderContent = () => {
    if (!coin) return <LoadingContainer />;
    const { token, userBalanceSymbolStr } = coin;
    const { feeAmountSymbolStr } = fee;
    return (
      <Form>
        {() => (
          <>
            <CustomInput />
            <RoundCornerButton
              title={STAKING_MESSAGES.withdrawSymbol(token.symbol)}
              style={coinStyled.button}
              onPress={navigateConfirm}
              disabled={disabled}
            />
            <RowSpaceText label="Balance" value={userBalanceSymbolStr} />
            <RowSpaceText label="Fee" value={feeAmountSymbolStr} />
          </>
        )}
      </Form>
    );
  };
  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.withdraw} />
      <View style={coinStyled.coinContainer}>
        {renderContent()}
      </View>
    </View>
  );
};

Input.propTypes = {
  onWithdrawMaxInvest: PropTypes.func.isRequired
};

export default React.memo(StakingWithdrawInvest);
