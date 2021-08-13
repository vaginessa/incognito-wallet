import React from 'react';
import { View } from 'react-native';
import { RFTradeInputAmount as TradeInputAmount } from '@components/core/reduxForm';
import { Field } from 'redux-form';
import { useSelector } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { SwapButton } from '@src/components/core';
import { formConfigs } from './Swap.constant';
import {
  sellTokenPairsSwapSelector,
  buyTokenPairsSwapSelector,
  selltokenSelector,
  buytokenSelector,
} from './Swap.selector';

const SwapInputsGroup = React.memo(() => {
  const navigation = useNavigation();
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
  return (
    <View>
      <Field
        component={TradeInputAmount}
        name={formConfigs.selltoken}
        hasInfinityIcon
        canSelectSymbol
        symbol={selltoken?.symbol}
        onPressSymbol={onSelectSellToken}
      />
      <SwapButton />
      <Field
        component={TradeInputAmount}
        name={formConfigs.buytoken}
        canSelectSymbol
        symbol={buytoken?.symbol}
        onPressSymbol={onSelectBuyToken}
      />
    </View>
  );
});

export default SwapInputsGroup;
