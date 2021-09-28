import React, {memo} from 'react';
import {ScrollView, View} from 'react-native';
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
import {Field} from 'redux-form';
import withLiquidity from '@screens/PDexV3/features/Liquidity/Liquidity.enhance';
import {createPoolSelector, liquidityActions} from '@screens/PDexV3/features/Liquidity';
import styled from '@screens/PDexV3/features/Liquidity/Liquidity.styled';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import {disableCreatePool} from '@screens/PDexV3/features/Liquidity/Liquidity.createPoolSelector';
import {ButtonTrade} from '@components/Button';
import {compose} from 'recompose';
import withTransaction from '@screens/PDexV3/features/Liquidity/Liquidity.enhanceTransaction';
import {NFTTokenBottomBar} from '@screens/PDexV3/features/NFTToken';
import {actionToggleModal} from '@components/Modal';
import {TradeSuccessModal} from '@screens/PDexV3/features/Trade';

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
  const inputToken = inputAmount(formConfigsCreatePool.formName, formConfigsCreatePool.inputToken);
  const outputToken = inputAmount(formConfigsCreatePool.formName, formConfigsCreatePool.outputToken);
  const _validateInput = React.useCallback(() => {
    return inputToken.error;
  }, [inputToken.error]);
  const _validateOutput = React.useCallback(() => {
    return outputToken.error;
  }, [outputToken.error]);
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
          _validateInput,
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
          onSelectToken: ((token) => {
            batch(() => {
              dispatch(liquidityActions.actionUpdateCreatePoolInputToken(token.tokenId));
              navigation.navigate(routeNames.CreatePool);
            });
          }),
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
          _validateOutput,
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
          onSelectToken: ((token) => {
            batch(() => {
              dispatch(liquidityActions.actionUpdateCreatePoolOutputToken(token.tokenId));
              navigation.navigate(routeNames.CreatePool);
            });
          }),
        })}
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
  const { disabled } = useSelector(disableCreatePool);
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
        <ScrollView>
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
