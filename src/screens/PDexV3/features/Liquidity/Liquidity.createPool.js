import React, {memo} from 'react';
import {ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header, RowSpaceText} from '@src/components';
import {LIQUIDITY_MESSAGES,formConfigsCreatePool} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';
import {createForm, RFTradeInputAmount as TradeInputAmount, validator} from '@components/core/reduxForm';
import {AddBreakLine, RoundCornerButton, Text} from '@components/core';
import {useDispatch, useSelector} from 'react-redux';
import {Field} from 'redux-form';
import withLiquidity from '@screens/PDexV3/features/Liquidity/Liquidity.enhance';
import {createPoolSelector, liquidityActions} from '@screens/PDexV3/features/Liquidity';
import styled from '@screens/PDexV3/features/Liquidity/Liquidity.styled';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';

const initialFormValues = {
  inputToken: '',
  outputToken: '',
  amp: ''
};

const Form = createForm(formConfigsCreatePool.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const InputsGroup = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const inputAmount = useSelector(createPoolSelector.inputAmountSelector);
  const inputTokens = useSelector(createPoolSelector.inputTokensListSelector);
  const outputTokens = useSelector(createPoolSelector.outputTokensListSelector);
  const inputToken = inputAmount(formConfigsCreatePool.formName, formConfigsCreatePool.inputToken);
  const outputToken = inputAmount(formConfigsCreatePool.formName, formConfigsCreatePool.outputToken);
  const onChangeText = ({ text, field }) => {
    dispatch(liquidityActions.actionSetCreatePoolText({
      text,
      field,
    }));
  };
  return (
    <View style={styled.wrapInput}>
      <Field
        component={TradeInputAmount}
        name={formConfigsCreatePool.inputToken}
        hasInfinityIcon
        canSelectSymbol
        symbol={inputToken && inputToken?.symbol}
        validate={[
          ...validator.combinedAmount,
        ]}
        onChange={(text) => {
          if (typeof onChangeText === 'function') {
            onChangeText({ text, field: formConfigsCreatePool.inputToken });
          }
        }}
        editableInput={!inputToken.loadingBalance}
        loadingBalance={inputToken.loadingBalance}
        onPressSymbol={() => navigation.navigate(routeNames.SelectTokenTrade, {
          data: inputTokens,
        })}
      />
      <AddBreakLine />
      <Field
        component={TradeInputAmount}
        name={formConfigsCreatePool.outputToken}
        hasInfinityIcon
        canSelectSymbol
        symbol={outputToken && outputToken?.symbol}
        validate={[
          ...validator.combinedAmount,
        ]}
        onChange={(text) => {
          if (typeof onChangeText === 'function') {
            onChangeText({ text, field: formConfigsCreatePool.outputToken });
          }
        }}
        editableInput={!outputToken.loadingBalance}
        loadingBalance={outputToken.loadingBalance}
        onPressSymbol={() => navigation.navigate(routeNames.SelectTokenTrade, {
          data: outputTokens,
        })}
      />
    </View>
  );
};

const Extra = React.memo(() => {
  const hooks = useSelector(createPoolSelector.hookFactoriesSelector);
  const renderHooks = () => {
    return hooks.map(item => <RowSpaceText {...item} key={item?.label} />);
  };
  return(
    <>
      {renderHooks()}
    </>
  );
});

const AMP = React.memo(() => (
  <View style={styled.wrapAMP}>
    <Text style={styled.amp}>AMP</Text>
    <Field
      component={TradeInputAmount}
      name={formConfigsCreatePool.amp}
      validate={[
        ...validator.combinedAmount,
      ]}
      editableInput
    />
  </View>
));

const CreatePool = ({ onInitCreatePool }) => {
  React.useEffect(() => { onInitCreatePool(); }, []);
  return (
    <View style={mainStyle.container}>
      <Header title={LIQUIDITY_MESSAGES.createPool} />
      <ScrollView>
        <Form>
          {({ handleSubmit }) => (
            <>
              <InputsGroup />
              <RoundCornerButton
                style={mainStyle.button}
                title={LIQUIDITY_MESSAGES.createPool}
              />
              <AMP />
              <Extra />
            </>
          )}
        </Form>
      </ScrollView>
    </View>
  );
};

CreatePool.propTypes = {
  onInitCreatePool: PropTypes.func.isRequired
};

export default withLiquidity(memo(CreatePool));
