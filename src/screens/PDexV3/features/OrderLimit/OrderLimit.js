import { Header } from '@src/components';
import {
  Divider,
  ScrollView,
  SwapButton,
  TradeInputAmount,
} from '@src/components/core';
import Tabs from '@src/components/core/Tabs';
import { withLayout_2 } from '@src/components/Layout';
import SelectPercentAmount from '@src/components/SelectPercentAmount';
import React from 'react';
import { View } from 'react-native';
import {
  ROOT_TAB_ORDER_LIMIT,
  TAB_BUY_ID,
  TAB_SELL_ID,
} from './OrderLimit.constant';
import { styled } from './OrderLimit.styled';

const OrderLimitInputsGroup = React.memo(() => {
  return (
    <View style={styled.inputGroups}>
      <TradeInputAmount hasInfinityIcon symbol="PRV" />
      <Divider dividerStyled={styled.dividerStyled} />
      <TradeInputAmount symbol="USDT" />
    </View>
  );
});

const OrderLimit = (props) => {
  const tabsFactories = [
    {
      tabID: TAB_BUY_ID,
      label: 'Buy',
      onChangeTab: () => null,
    },
    {
      tabID: TAB_SELL_ID,
      label: 'Sell',
      onChangeTab: () => null,
    },
  ];
  const handleSelectPercent = (percent) => {
    console.log('percent', percent);
  };
  return (
    <View style={styled.container}>
      <Header title="PRV/XMR" />
      <ScrollView style={styled.scrollview}>
        <Tabs rootTabID={ROOT_TAB_ORDER_LIMIT}>
          {tabsFactories.map((tab) => (
            <View key={tab.tabID} {...tab} />
          ))}
        </Tabs>
        <OrderLimitInputsGroup />
        <SelectPercentAmount
          size={4}
          handleSelectPercent={handleSelectPercent}
          containerStyled={styled.selectPercentAmountContainer}
        />
      </ScrollView>
    </View>
  );
};

OrderLimit.propTypes = {};

export default withLayout_2(React.memo(OrderLimit));
