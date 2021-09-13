import React, {memo} from 'react';
import {ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header, RowSpaceText} from '@src/components';
import {formConfigsRemovePool, LIQUIDITY_MESSAGES} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';
import withLiquidity from '@screens/PDexV3/features/Liquidity/Liquidity.enhance';
import {createForm, RFTradeInputAmount as TradeInputAmount, validator} from '@components/core/reduxForm';
import styled from '@screens/PDexV3/features/Liquidity/Liquidity.styled';
import {Field} from 'redux-form';
import {AddBreakLine, RoundCornerButton} from '@components/core';
import {useDispatch, useSelector} from 'react-redux';
import {liquidityActions, removePoolSelector} from '@screens/PDexV3/features/Liquidity/index';

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
  const inputAmount = useSelector(removePoolSelector.inputAmountSelector);
  const inputToken = inputAmount(formConfigsRemovePool.formName, formConfigsRemovePool.inputToken);
  const outputToken = inputAmount(formConfigsRemovePool.formName, formConfigsRemovePool.outputToken);
  const onChangeInput = (text) => dispatch(liquidityActions.actionChangeInputRemovePool(text));
  const onChangeOutput = (text) => dispatch(liquidityActions.actionChangeOutputRemovePool(text));
  return (
    <View style={styled.wrapInput}>
      <Field
        component={TradeInputAmount}
        name={formConfigsRemovePool.inputToken}
        validate={[
          ...validator.combinedAmount,
        ]}
        hasInfinityIcon
        editableInput={!inputToken.loadingBalance}
        symbol={inputToken && inputToken?.symbol}
        onChange={onChangeInput}
      />
      <AddBreakLine />
      <Field
        component={TradeInputAmount}
        name={formConfigsRemovePool.outputToken}
        validate={[
          ...validator.combinedAmount,
        ]}
        symbol={outputToken && outputToken?.symbol}
        editableInput={!outputToken.loadingBalance}
        onChange={onChangeOutput}
      />
    </View>
  );
};

const Extra = React.memo(() => {
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

const RemovePool = ({ onInitRemovePool }) => {
  React.useEffect(() => { onInitRemovePool(); }, []);
  return (
    <View style={mainStyle.container}>
      <Header title={LIQUIDITY_MESSAGES.removePool} />
      <ScrollView>
        <Form>
          {({ handleSubmit }) => (
            <>
              <InputsGroup />
              <RoundCornerButton
                style={mainStyle.button}
                title={LIQUIDITY_MESSAGES.removePool}
              />
              <Extra />
            </>
          )}
        </Form>
      </ScrollView>
    </View>
  );
};

RemovePool.propTypes = {
  onInitRemovePool: PropTypes.func.isRequired
};

export default withLiquidity(memo(RemovePool));
