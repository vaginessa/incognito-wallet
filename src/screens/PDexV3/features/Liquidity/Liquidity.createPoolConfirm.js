import React, {memo} from 'react';
import {ScrollView, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header} from '@src/components';
import {formConfigsCreatePool, LIQUIDITY_MESSAGES} from '@screens/PDexV3/features/Liquidity/Liquidity.constant';
import {ButtonTrade} from '@components/Button';
import {Extra} from '@screens/PDexV3/features/Liquidity/Liquidity.createPool';
import {useDispatch, useSelector} from 'react-redux';
import {createPoolSelector} from '@screens/PDexV3/features/Liquidity/index';
import {actionGetPDexV3Inst} from '@screens/PDexV3';
import {ExHandler} from '@services/exception';

const Confirm = () => {
  const dispatch = useDispatch();
  const amountSelector = useSelector(createPoolSelector.inputAmountSelector);
  const inputAmount = amountSelector(formConfigsCreatePool.formName, formConfigsCreatePool.inputToken);
  const outputAmount = amountSelector(formConfigsCreatePool.formName, formConfigsCreatePool.outputToken);
  const { feeAmount } = useSelector(createPoolSelector.feeAmountSelector);
  const { amp } = useSelector(createPoolSelector.ampValueSelector);
  const createNewPool = async () => {
    try {
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      await pDexV3Inst.createContributeTxs({
        fee: feeAmount,
        tokenId1: inputAmount.tokenId,
        tokenId2: outputAmount.tokenId,
        amount1: inputAmount.originalInputAmount,
        amount2: outputAmount.originalInputAmount,
        poolPairID: '',
        amp
      });
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  return (
    <View style={mainStyle.container}>
      <Header title={LIQUIDITY_MESSAGES.createPool} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={mainStyle.mainInfo}>
          <Text style={mainStyle.bigText}>Add</Text>
          <Text style={mainStyle.bigText}>{`${inputAmount.inputAmountSymbolStr} + ${outputAmount.inputAmountSymbolStr}`}</Text>
        </View>
        <Extra />
        <ButtonTrade
          btnStyle={mainStyle.button}
          title={LIQUIDITY_MESSAGES.addLiquidity}
          onPress={createNewPool}
        />
      </ScrollView>
    </View>
  );
};

Confirm.propTypes = {};

export default memo(Confirm);
