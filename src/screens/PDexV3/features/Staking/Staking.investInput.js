import React from 'react';
import {View} from 'react-native';
import {createForm, RFTradeInputAmount as TradeInputAmount, validator} from '@components/core/reduxForm';
import {formConfigsInvest, STAKING_MESSAGES} from '@screens/PDexV3/features/Staking/Staking.constant';
import {useDispatch, useSelector} from 'react-redux';
import {change, Field} from 'redux-form';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import Header from '@components/Header/Header';
import {coinStyles as coinStyled} from '@screens/PDexV3/features/Staking/Staking.styled';
import {RoundCornerButton, Text} from '@components/core';
import {LoadingContainer} from '@src/components';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import withInput from '@screens/PDexV3/features/Staking/Staking.enhanceInput';
import PropTypes from 'prop-types';
import {stakingSelector} from '@screens/PDexV3/features/Staking';
import withInvest from '@screens/PDexV3/features/Staking/Staking.investEnhance';
import {compose} from 'recompose';
import withTransaction from '@screens/PDexV3/features/Staking/Staking.transaction';

const initialFormValues = {
  input: ''
};

const Form = createForm(formConfigsInvest.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const Input = React.memo(({ onInvestMax, onSymbolPress }) => {
  const dispatch = useDispatch();
  const { maxDepositText, token } = useSelector(stakingSelector.investInputAmount);
  const inputValidate = useSelector(stakingSelector.investInputValidate);
  const onChangeText = (text) => dispatch(change(formConfigsInvest.formName, formConfigsInvest.input, text));
  const onChangeMaxInvest = () => onInvestMax(maxDepositText);
  return(
    <Field
      component={TradeInputAmount}
      name={formConfigsInvest.input}
      hasInfinityIcon
      validate={[
        ...validator.combinedAmount,
        inputValidate,
      ]}
      symbol={token && token?.symbol}
      onChange={onChangeText}
      editableInput
      canSelectSymbol
      onPressInfinityIcon={onChangeMaxInvest}
      wrapInputStyle={coinStyled.wrapInput}
      inputStyle={coinStyled.input}
      symbolStyle={coinStyled.symbol}
      infiniteStyle={coinStyled.infinite}
      onPressSymbol={onSymbolPress}
    />
  );
});

const CustomInput = withInput(Input);

const StakingMoreInput = React.memo(({ onSymbolPress, onStaking, error }) => {
  const navigation = useNavigation();
  const pool = useSelector(stakingSelector.investPoolSelector);
  const { feeAmount } = useSelector(stakingSelector.stakingFeeSelector);
  const { nftStaking } = useSelector(stakingSelector.investStakingCoinSelector);
  const { inputValue, tokenId } = useSelector(stakingSelector.investInputAmount);
  const disable = useSelector(stakingSelector.investDisable);
  const onSubmit = () => {
    if (!feeAmount || !tokenId || !inputValue || !nftStaking) return;
    const params = {
      fee: feeAmount,
      tokenID: tokenId,
      tokenAmount: inputValue,
      nftID: nftStaking
    };
    typeof onStaking === 'function' && onStaking(params);
  };
  const renderContent = () => {
    if (!pool) return <LoadingContainer />;
    return (
      <Form>
        {() => (
          <>
            <Text style={coinStyled.smallGray}>
              {`Balance: ${pool.userBalanceSymbolStr}`}
            </Text>
            <CustomInput onSymbolPress={onSymbolPress} />
            {!!error && (<Text style={coinStyled.error}>{error}</Text>)}
            <RoundCornerButton
              title={STAKING_MESSAGES.staking}
              style={coinStyled.button}
              disabled={disable || !!error}
              onPress={onSubmit}
            />
          </>
        )}
      </Form>
    );
  };
  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.staking} />
      <View style={coinStyled.coinContainer}>
        {renderContent()}
      </View>
    </View>
  );
});

Input.propTypes = {
  onInvestMax: PropTypes.func.isRequired,
  onSymbolPress: PropTypes.func.isRequired
};

StakingMoreInput.defaultProps = {
  error: undefined
};
StakingMoreInput.propTypes = {
  onSymbolPress: PropTypes.func.isRequired,
  onStaking: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default compose(
  withTransaction,
  withInvest
)(StakingMoreInput);
