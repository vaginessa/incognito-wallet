import React, {memo} from 'react';
import {View} from 'react-native';
import {createForm, RFTradeInputAmount as TradeInputAmount, validator} from '@components/core/reduxForm';
import {formConfigsInvest, STAKING_MESSAGES} from '@screens/PDexV3/features/Staking/Staking.constant';
import {batch, useDispatch, useSelector} from 'react-redux';
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
import {stakingActions, stakingSelector} from '@screens/PDexV3/features/Staking';
import {BottomModalActions} from '@components/core/BottomModal';
import {HeaderRow, OneRowCoin} from '@screens/PDexV3/features/Staking/Staking.item';

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

const StakingMoreInput = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const coin = useSelector(stakingSelector.investCoinSelector);
  const pools = useSelector(stakingSelector.stakingPoolSelector);
  const disable = useSelector(stakingSelector.investDisable);
  const navigateConfirm = () => navigation.navigate(routeNames.StakingMoreConfirm);
  const onSelectToken = (tokenId) => (
    batch(() => {
      dispatch(stakingActions.actionSetInvestCoin({ tokenID: tokenId }));
      dispatch(BottomModalActions.actionCloseModal());
    })
  );
  const renderModelCell = (data) => (
    <OneRowCoin
      token={data.token}
      valueText={data.userBalanceStr}
      data={data.tokenId}
      disabled={!data.userBalance}
      onPress={onSelectToken}
    />
  );
  const onSymbolPress = () => {
    dispatch(BottomModalActions.actionOpenModal({
      title: 'Select coins',
      customHeader: <HeaderRow array={['Name', 'Amount']} />,
      customContent: <View style={{ marginTop: 24 }}>{pools.map(renderModelCell)}</View>
    }));
  };
  const renderContent = () => {
    if (!coin) return <LoadingContainer />;
    return (
      <Form>
        {() => (
          <>
            <Text style={coinStyled.smallGray}>
              {`Balance: ${coin.userBalanceSymbolStr}`}
            </Text>
            <CustomInput onSymbolPress={onSymbolPress} />
            <RoundCornerButton
              title={STAKING_MESSAGES.staking}
              style={coinStyled.button}
              disabled={disable}
              onPress={navigateConfirm}
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
};

Input.propTypes = {
  onInvestMax: PropTypes.func.isRequired
};

export default memo(StakingMoreInput);
