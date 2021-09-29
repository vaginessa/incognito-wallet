import React, {memo} from 'react';
import {ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header, RowSpaceText, SuccessModal} from '@src/components';
import {
  formConfigsRemovePool,
  LIQUIDITY_MESSAGES,
  SUCCESS_MODAL
} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';
import withLiquidity from '@screens/PDexV3/features/Liquidity/Liquidity.enhance';
import {createForm, RFTradeInputAmount as TradeInputAmount, validator} from '@components/core/reduxForm';
import styled from '@screens/PDexV3/features/Liquidity/Liquidity.styled';
import {Field} from 'redux-form';
import {AddBreakLine} from '@components/core';
import {useDispatch, useSelector} from 'react-redux';
import {liquidityActions, removePoolSelector} from '@screens/PDexV3/features/Liquidity/index';
import {ButtonTrade} from '@components/Button';
import SelectPercentAmount from '@components/SelectPercentAmount';
import {COLORS} from '@src/styles';
import {compose} from 'recompose';
import withTransaction from '@screens/PDexV3/features/Liquidity/Liquidity.enhanceTransaction';

const initialFormValues = {
  inputToken: '',
  outputToken: '',
};

const Form = createForm(formConfigsRemovePool.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const InputsGroup = () => {
  const dispatch = useDispatch();
  const [percent, setPercent] = React.useState(0);
  const inputAmount = useSelector(removePoolSelector.inputAmountSelector);
  const inputToken = inputAmount(formConfigsRemovePool.formName, formConfigsRemovePool.inputToken);
  const outputToken = inputAmount(formConfigsRemovePool.formName, formConfigsRemovePool.outputToken);
  const onChangeInput = (text) => dispatch(liquidityActions.actionChangeInputRemovePool(text));
  const onChangeOutput = (text) => dispatch(liquidityActions.actionChangeOutputRemovePool(text));
  const onMaxPress = () => dispatch(liquidityActions.actionMaxRemovePool());
  const onChangePercent = (_percent) => {
    setPercent(_percent);
    if (_percent === 100) {
      return onMaxPress();
    }
    dispatch(liquidityActions.actionChangePercentRemovePool(_percent));
  };
  const _validateInput = React.useCallback(() => {
    return inputToken.error;
  }, [inputToken.error]);
  const _validateOutput = React.useCallback(() => {
    return outputToken.error;
  }, [outputToken.error]);
  return (
    <View style={styled.wrapInput}>
      <Field
        component={TradeInputAmount}
        name={formConfigsRemovePool.inputToken}
        validate={[
          _validateInput,
          ...validator.combinedAmount,
        ]}
        hasInfinityIcon
        editableInput={!inputToken.loadingBalance}
        symbol={inputToken && inputToken?.symbol}
        onChange={onChangeInput}
        onPressInfinityIcon={onMaxPress}
      />
      <AddBreakLine />
      <Field
        component={TradeInputAmount}
        name={formConfigsRemovePool.outputToken}
        validate={[
          _validateOutput,
          ...validator.combinedAmount,
        ]}
        symbol={outputToken && outputToken?.symbol}
        editableInput={!outputToken.loadingBalance}
        onChange={onChangeOutput}
        onPressInfinityIcon={onMaxPress}
      />
      <SelectPercentAmount
        size={4}
        containerStyled={styled.selectPercentAmountContainer}
        percentBtnColor={COLORS.colorBlue}
        selected={percent}
        onPressPercent={onChangePercent}
      />
    </View>
  );
};

export const Extra = React.memo(() => {
  const data = useSelector(removePoolSelector.shareDataSelector);
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

const RemoveLPButton = React.memo(({ onSubmit }) => {
  const { disabled } = useSelector(removePoolSelector.disableRemovePool);
  const amountSelector = useSelector(removePoolSelector.inputAmountSelector);
  const { feeAmount } = useSelector(removePoolSelector.feeAmountSelector);
  const poolId = useSelector(removePoolSelector.poolIDSelector);
  const nftId = useSelector(removePoolSelector.nftTokenSelector);
  const inputAmount = amountSelector(formConfigsRemovePool.formName, formConfigsRemovePool.inputToken);
  const outputAmount = amountSelector(formConfigsRemovePool.formName, formConfigsRemovePool.outputToken);

  const handleSubmit = () => {
    if (disabled) return;
    const params = {
      fee: feeAmount,
      poolTokenIDs: [inputAmount.tokenId, outputAmount.tokenId],
      poolPairID: poolId,
      shareAmount: inputAmount.withdraw,
      nftID: nftId,
    };
    onSubmit(params);
  };

  return (
    <ButtonTrade
      btnStyle={mainStyle.button}
      title={LIQUIDITY_MESSAGES.removePool}
      disabled={disabled}
      onPress={handleSubmit}
    />
  );
});

const RemovePool = ({
  onInitRemovePool,
  onRemoveContribute,
  onCloseModal,
  visible
}) => {
  const onSubmit = (params) => {
    typeof onRemoveContribute === 'function' && onRemoveContribute(params);
  };
  const onClose = () => {
    onCloseModal();
    onInitRemovePool();
  };

  const renderContent = () => (
    <>
      <InputsGroup />
      <RemoveLPButton onSubmit={onSubmit} />
      <Extra />
    </>
  );

  React.useEffect(() => { onInitRemovePool(); }, []);
  return (
    <>
      <View style={mainStyle.container}>
        <Header title={LIQUIDITY_MESSAGES.removePool} />
        <ScrollView>
          <Form>
            {renderContent()}
          </Form>
        </ScrollView>
      </View>
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

RemovePool.propTypes = {
  onInitRemovePool: PropTypes.func.isRequired,
  onRemoveContribute: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

RemoveLPButton.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};


export default compose(
  withLiquidity,
  withTransaction,
)(memo(RemovePool));
