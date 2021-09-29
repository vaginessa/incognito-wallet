import React, {memo} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header, RowSpaceText, SuccessModal} from '@src/components';
import {
  LIQUIDITY_MESSAGES,
  formConfigsCreatePool,
  SUCCESS_MODAL
} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';
import {createForm, RFTradeInputAmount as TradeInputAmount, validator} from '@components/core/reduxForm';
import {AddBreakLine} from '@components/core';
import {batch, useDispatch, useSelector} from 'react-redux';
import {change, Field} from 'redux-form';
import withLiquidity from '@screens/PDexV3/features/Liquidity/Liquidity.enhance';
import {createPoolSelector, liquidityActions} from '@screens/PDexV3/features/Liquidity';
import styled from '@screens/PDexV3/features/Liquidity/Liquidity.styled';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import {ButtonTrade} from '@components/Button';
import {compose} from 'recompose';
import withTransaction from '@screens/PDexV3/features/Liquidity/Liquidity.enhanceTransaction';
import {NFTTokenBottomBar} from '@screens/PDexV3/features/NFTToken';

const initialFormValues = {
  inputToken: '',
  outputToken: '',
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
  const focusField = useSelector(createPoolSelector.focusFieldSelector);
  const isTyping = useSelector(createPoolSelector.isTypingSelector);
  const inputToken = inputAmount(formConfigsCreatePool.formName, formConfigsCreatePool.inputToken);
  const outputToken = inputAmount(formConfigsCreatePool.formName, formConfigsCreatePool.outputToken);
  const onChangeText = (text) => dispatch(liquidityActions.actionSetCreatePoolText(text));
  const onFocusToken = (e, focusField) =>  dispatch(liquidityActions.actionSetFocusCreatePool({ focusField }));
  const onGetRate = () => {
    if (!inputToken.originalInputAmount || !outputToken.originalInputAmount || !inputToken.tokenId || !outputToken.tokenId) return;
    const params = {
      inputAmount: inputToken.originalInputAmount,
      inputToken: inputToken.tokenId,
      outputAmount: outputToken.originalInputAmount,
      outputToken: outputToken.tokenId,
    };
    dispatch(liquidityActions.actionSetTypingCreatePool({ isTyping: true }));
    liquidityActions.debouncedGetCreatePoolRate.cancel();
    dispatch(liquidityActions.asyncActionDebounced(params, liquidityActions.debouncedGetCreatePoolRate));
  };
  const _validateInput = React.useCallback(() => {
    return inputToken.error;
  }, [inputToken.error]);
  const _validateOutput = React.useCallback(() => {
    return outputToken.error;
  }, [outputToken.error]);

  const loading = React.useMemo(() => ({
    input: inputToken.loadingBalance || (isTyping && focusField === formConfigsCreatePool.inputToken),
    output: outputToken.loadingBalance || (isTyping && focusField === formConfigsCreatePool.outputToken),
  }), [focusField, isTyping, inputToken.loadingBalance, outputToken.loadingBalance]);

  React.useEffect(() => {
    onGetRate();
  }, [
    inputToken.originalInputAmount,
    inputToken.tokenId,
    outputToken.originalInputAmount,
    outputToken.tokenId,
  ]);

  return (
    <View style={styled.wrapInput}>
      <Field
        component={TradeInputAmount}
        name={formConfigsCreatePool.inputToken}
        hasInfinityIcon
        canSelectSymbol
        symbol={inputToken && inputToken?.symbol}
        validate={[
          _validateInput,
          ...validator.combinedAmount,
        ]}
        onFocus={(e) => onFocusToken(e, formConfigsCreatePool.inputToken)}
        onChange={onChangeText}
        editableInput={!inputToken.loadingBalance}
        loadingBalance={loading.input}
        onPressSymbol={() => {
          if (loading.input) return;
          navigation.navigate(routeNames.SelectTokenTrade, {
            data: inputTokens,
            onSelectToken: ((token) => {
              batch(() => {
                dispatch(liquidityActions.actionUpdateCreatePoolInputToken(token.tokenId));
                navigation.navigate(routeNames.CreatePool);
              });
            }),
          });
        }}
        onPressInfinityIcon={() => {
          dispatch(change(formConfigsCreatePool.formName, formConfigsCreatePool.inputToken, inputToken.maxOriginalAmountText));
        }}
      />
      <AddBreakLine />
      <Field
        component={TradeInputAmount}
        name={formConfigsCreatePool.outputToken}
        hasInfinityIcon
        canSelectSymbol
        symbol={outputToken && outputToken?.symbol}
        validate={[
          _validateOutput,
          ...validator.combinedAmount,
        ]}
        onChange={onChangeText}
        editableInput={!outputToken.loadingBalance}
        loadingBalance={loading.output}
        onPressSymbol={() => {
          if (loading.output) return;
          navigation.navigate(routeNames.SelectTokenTrade, {
            data: outputTokens,
            onSelectToken: ((token) => {
              batch(() => {
                dispatch(liquidityActions.actionUpdateCreatePoolOutputToken(token.tokenId));
                navigation.navigate(routeNames.CreatePool);
              });
            }),
          });
        }}
        onPressInfinityIcon={() => {
          dispatch(change(formConfigsCreatePool.formName, formConfigsCreatePool.outputToken, outputToken.maxOriginalAmountText));
        }}
        onFocus={(e) => onFocusToken(e, formConfigsCreatePool.outputToken)}
      />
    </View>
  );
};

export const Extra = React.memo(() => {
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

const ButtonCreatePool = React.memo(({ onSubmit }) => {
  const { disabled } = useSelector(createPoolSelector.disableCreatePool);
  const amountSelector = useSelector(createPoolSelector.inputAmountSelector);
  const inputAmount = amountSelector(formConfigsCreatePool.formName, formConfigsCreatePool.inputToken);
  const outputAmount = amountSelector(formConfigsCreatePool.formName, formConfigsCreatePool.outputToken);
  const { feeAmount } = useSelector(createPoolSelector.feeAmountSelector);
  const { amp } = useSelector(createPoolSelector.ampValueSelector);
  const handleSubmit = () => {
    if (disabled) return;
    const params = {
      fee: feeAmount / 2,
      tokenId1: inputAmount.tokenId,
      tokenId2: outputAmount.tokenId,
      amount1: inputAmount.originalInputAmount,
      amount2: outputAmount.originalInputAmount,
      amp,
    };
    onSubmit(params);
  };
  return (
    <ButtonTrade
      btnStyle={mainStyle.button}
      title={LIQUIDITY_MESSAGES.createPool}
      disabled={disabled}
      onPress={handleSubmit}
    />
  );
});

const CreatePool = ({
  onInitCreatePool,
  onFreeCreatePool,
  onCreateNewPool,
  visible,
  onCloseModal
}) => {
  const isFetching = useSelector(createPoolSelector.isFetchingSelector);
  const onSubmit = (params) => {
    typeof onCreateNewPool === 'function' && onCreateNewPool(params);
  };

  const onClose = () => {
    onCloseModal();
    onInitCreatePool();
  };

  const renderContent = () => (
    <>
      <InputsGroup />
      <ButtonCreatePool onSubmit={onSubmit} />
      <Extra />
    </>
  );
  React.useEffect(() => {
    onInitCreatePool();
    return () => onFreeCreatePool();
  }, []);
  return (
    <>
      <View style={mainStyle.container}>
        <Header title={LIQUIDITY_MESSAGES.createPool} />
        <ScrollView
          refreshControl={(<RefreshControl refreshing={isFetching} onRefresh={onInitCreatePool} />)}
          showsVerticalScrollIndicator={false}
        >
          <Form>
            {renderContent()}
          </Form>
        </ScrollView>
      </View>
      <NFTTokenBottomBar />
      <SuccessModal
        closeSuccessDialog={onClose}
        title={SUCCESS_MODAL.ADD_POOL.title}
        buttonTitle="Ok"
        description={SUCCESS_MODAL.ADD_POOL.desc}
        visible={visible}
      />
    </>
  );
};

CreatePool.propTypes = {
  onInitCreatePool: PropTypes.func.isRequired,
  onFreeCreatePool: PropTypes.func.isRequired,
  onCreateNewPool: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

ButtonCreatePool.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default compose(
  withLiquidity,
  withTransaction,
)(memo(CreatePool));
