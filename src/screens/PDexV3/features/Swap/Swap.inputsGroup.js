import React from 'react';
import { View } from 'react-native';
import {
  RFTradeInputAmount as TradeInputAmount,
  validator,
} from '@components/core/reduxForm';
import { change, Field } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { SwapButton } from '@src/components/core';
import { maxAmountValidatorForSellInput } from './Swap.utils';
import { formConfigs } from './Swap.constant';
import {
  pairsTokenSelector,
  selltokenSelector,
  buytokenSelector,
  swapSelector,
  inputAmountSelector,
  swapInfoSelector,
} from './Swap.selector';
import {
  actionEstimateTrade,
  actionSelectToken,
  actionSetFocusToken,
  actionSwapToken,
} from './Swap.actions';

const SwapInputsGroup = React.memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const swapInfo = useSelector(swapInfoSelector);
  const swap = useSelector(swapSelector);
  const pairsToken = useSelector(pairsTokenSelector);
  const selltoken = useSelector(selltokenSelector);
  const buytoken = useSelector(buytokenSelector);
  const inputAmount = useSelector(inputAmountSelector);
  const sellInputAmount = inputAmount(formConfigs.selltoken);
  const buyInputAmount = inputAmount(formConfigs.buytoken);
  const onSelectToken = (token, field) => {
    dispatch(actionSelectToken(token, field));
    navigation.pop();
  };
  const onSelectSellToken = () =>
    navigation.navigate(routeNames.SelectTokenTrade, {
      data: pairsToken,
      onSelectToken: (token) => onSelectToken(token, formConfigs.selltoken),
    });
  const onSelectBuyToken = () =>
    navigation.navigate(routeNames.SelectTokenTrade, {
      data: pairsToken,
      onSelectToken: (token) => onSelectToken(token, formConfigs.buytoken),
    });
  const onFocusToken = (e, field) => dispatch(actionSetFocusToken(swap[field]));
  const onEndEditing = () => dispatch(actionEstimateTrade());
  const onSwapButtons = () => dispatch(actionSwapToken());
  let _maxAmountValidatorForSellInput = React.useCallback(
    () => maxAmountValidatorForSellInput(sellInputAmount),
    [
      sellInputAmount?.originalAmount,
      sellInputAmount?.availableOriginalAmount,
      sellInputAmount?.availableAmountText,
      sellInputAmount?.symbol,
    ],
  );
  const onPressInfinityIcon = () => {
    dispatch(
      change(
        formConfigs.formName,
        formConfigs.selltoken,
        sellInputAmount.availableAmountText,
      ),
    );
    dispatch(actionEstimateTrade());
  };

  return (
    <View>
      <Field
        component={TradeInputAmount}
        name={formConfigs.selltoken} //
        hasInfinityIcon
        canSelectSymbol
        symbol={selltoken?.symbol}
        onPressSymbol={onSelectSellToken}
        onFocus={(e) => onFocusToken(e, formConfigs.selltoken)}
        onEndEditing={onEndEditing}
        onPressInfinityIcon={onPressInfinityIcon}
        validate={[
          ...validator.combinedAmount,
          _maxAmountValidatorForSellInput,
        ]}
        loadingBalance={!!sellInputAmount?.loadingBalance}
        editableInput={!!swapInfo?.editableInput}
      />
      <SwapButton onSwapButtons={onSwapButtons} />
      <Field
        component={TradeInputAmount}
        name={formConfigs.buytoken} //
        canSelectSymbol
        symbol={buytoken?.symbol}
        onPressSymbol={onSelectBuyToken}
        onFocus={(e) => onFocusToken(e, formConfigs.buytoken)}
        onEndEditing={onEndEditing}
        validate={[...validator.combinedAmount]}
        loadingBalance={!!buyInputAmount?.loadingBalance}
        editableInput={!!swapInfo?.editableInput}
      />
    </View>
  );
});

export default SwapInputsGroup;
