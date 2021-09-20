import React, {memo} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header, RowSpaceText} from '@src/components';
import {LIQUIDITY_MESSAGES, formConfigsContribute} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';
import {createForm, RFTradeInputAmount as TradeInputAmount, validator} from '@components/core/reduxForm';
import {useDispatch, useSelector} from 'react-redux';
import styled from '@screens/PDexV3/features/Liquidity/Liquidity.styled';
import {Field} from 'redux-form';
import {AddBreakLine} from '@components/core';
import withLiquidity from '@screens/PDexV3/features/Liquidity/Liquidity.enhance';
import {contributeSelector, liquidityActions} from '@screens/PDexV3/features/Liquidity';
import {ButtonTrade} from '@components/Button';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import {NFTTokenBottomBar} from '@screens/PDexV3/features/NFTToken';
import {switchAccountSelector} from '@src/redux/selectors/account';

const initialFormValues = {
  inputToken: '',
  outputToken: '',
};

const Form = createForm(formConfigsContribute.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const InputsGroup = () => {
  const dispatch = useDispatch();
  const { inputToken, outputToken } = useSelector(contributeSelector.mappingDataSelector);
  const onChangeInput = (newText) => dispatch(liquidityActions.actionChangeInputContribute(newText));
  const onChangeOutput = (newText) => dispatch(liquidityActions.actionChangeOutputContribute(newText));
  const onMaxInput = (newText) => dispatch(liquidityActions.actionChangeInputContribute(newText));
  const onMaxOutput = (newText) => dispatch(liquidityActions.actionChangeOutputContribute(newText));
  const amountSelector = useSelector(contributeSelector.inputAmountSelector);
  const inputAmount = amountSelector(formConfigsContribute.formName, formConfigsContribute.inputToken);
  const outputAmount = amountSelector(formConfigsContribute.formName, formConfigsContribute.outputToken);
  const _validateInput = React.useCallback(() => {
    return inputAmount.error;
  }, [inputAmount.error]);
  const _validateOutput = React.useCallback(() => {
    return outputAmount.error;
  }, [outputAmount.error]);
  return (
    <View style={styled.wrapInput}>
      <Field
        component={TradeInputAmount}
        name={formConfigsContribute.inputToken}
        hasInfinityIcon={inputAmount.maxOriginalAmount}
        symbol={inputToken && inputToken?.symbol}
        validate={[
          _validateInput,
          ...validator.combinedAmount,
        ]}
        onChange={onChangeInput}
        editableInput={!inputAmount.loadingBalance}
        loadingBalance={inputAmount.loadingBalance}
        onPressInfinityIcon={() => onMaxInput(inputAmount.maxOriginalAmountText)}
      />
      <AddBreakLine />
      <Field
        component={TradeInputAmount}
        name={formConfigsContribute.outputToken}
        hasInfinityIcon={outputAmount.maxOriginalAmount}
        symbol={outputToken && outputToken?.symbol}
        validate={[
          _validateOutput,
          ...validator.combinedAmount,
        ]}
        onChange={onChangeOutput}
        editableInput={!outputAmount.loadingBalance}
        loadingBalance={outputAmount.loadingBalance}
        onPressInfinityIcon={() => onMaxOutput(outputAmount.maxOriginalAmountText)}
      />
    </View>
  );
};

export const Extra = React.memo(() => {
  const data = useSelector(contributeSelector.mappingDataSelector);
  const renderHooks = () => {
    if (!data) return;
    return (data?.hookFactories || []).map(item => <RowSpaceText {...item} key={item?.label} />);
  };
  return(
    <>
      {renderHooks()}
    </>
  );
});

const Contribute = ({ onInitContribute }) => {
  const navigation = useNavigation();
  const isFetching = useSelector(contributeSelector.statusSelector);
  const disableContribute = useSelector(contributeSelector.disableContribute);
  const switching = useSelector(switchAccountSelector);
  const navigateConfirm = () => navigation.navigate(routeNames.ContributeConfirm);
  React.useEffect(() => {
    if (typeof onInitContribute === 'function' && !switching) onInitContribute();
  }, [switching]);
  return (
    <>
      <View style={mainStyle.container}>
        <Header title={LIQUIDITY_MESSAGES.addLiquidity} accountSelectable />
        <ScrollView refreshControl={(<RefreshControl refreshing={isFetching} onRefresh={onInitContribute} />)}>
          <Form>
            {({ handleSubmit }) => (
              <>
                <InputsGroup />
                <ButtonTrade
                  btnStyle={mainStyle.button}
                  title={LIQUIDITY_MESSAGES.addLiquidity}
                  disabled={disableContribute}
                  onPress={navigateConfirm}
                />
                <Extra />
              </>
            )}
          </Form>
        </ScrollView>
      </View>
      <NFTTokenBottomBar />
    </>
  );
};

Contribute.propTypes = {
  onInitContribute: PropTypes.func.isRequired
};

export default withLiquidity(memo(Contribute));
