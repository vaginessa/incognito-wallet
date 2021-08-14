import React from 'react';
import { View } from 'react-native';
import { RFTradeInputAmount as TradeInputAmount } from '@components/core/reduxForm';
import { Field } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { SwapButton } from '@src/components/core';
import { formConfigs } from './Swap.constant';
import {
  sellTokenPairsSwapSelector,
  buyTokenPairsSwapSelector,
  selltokenSelector,
  buytokenSelector,
  swapSelector,
} from './Swap.selector';
import { actionEstimateTrade, actionSetFocusToken } from './Swap.actions';

const SwapInputsGroup = React.memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const swap = useSelector(swapSelector);
  const pairsSell = useSelector(sellTokenPairsSwapSelector);
  const pairsBuy = useSelector(buyTokenPairsSwapSelector);
  const selltoken = useSelector(selltokenSelector);
  const buytoken = useSelector(buytokenSelector);
  const onSelectSellToken = () => {
    navigation.navigate(routeNames.SelectTokenTrade, { data: pairsSell });
  };
  const onSelectBuyToken = () => {
    navigation.navigate(routeNames.SelectTokenTrade, { data: pairsBuy });
  };
  const onFocusToken = (e, field) => dispatch(actionSetFocusToken(swap[field]));
  const onEndEditing = () => dispatch(actionEstimateTrade());
  return (
    <View>
      <Field
        component={TradeInputAmount}
        name={formConfigs.selltoken}
        hasInfinityIcon
        canSelectSymbol
        symbol={selltoken?.symbol}
        onPressSymbol={onSelectSellToken}
        onFocus={(e) => onFocusToken(e, formConfigs.selltoken)}
        onEndEditing={onEndEditing}
      />
      <SwapButton />
      <Field
        component={TradeInputAmount}
        name={formConfigs.buytoken}
        canSelectSymbol
        symbol={buytoken?.symbol}
        onPressSymbol={onSelectBuyToken}
        onFocus={(e) => onFocusToken(e, formConfigs.buytoken)}
        onEndEditing={onEndEditing}
      />
    </View>
  );
});

export default SwapInputsGroup;
