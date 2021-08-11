import { Header } from '@src/components';
import {
  Divider,
  KeyboardAwareScrollView,
  TradeInputAmount,
} from '@src/components/core';
import Tabs from '@src/components/core/Tabs';
import { withLayout_2 } from '@src/components/Layout';
import SelectPercentAmount from '@src/components/SelectPercentAmount';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '@src/styles';
import GroupActions from './OrderLimit.groupActions';
import GroupRate from './OrderLimit.groupRate';
import {
  ROOT_TAB_ORDER_LIMIT,
  TAB_BUY_ID,
  TAB_SELL_ID,
} from './OrderLimit.constant';
import { styled } from './OrderLimit.styled';
import { orderLimitDataSelector } from './OrderLimit.selector';
import SubInfo from './OrderLimit.subInfo';
import OpenOrders from './OrderLimit.openOrders';

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
  const { mainColor, sellColor, buyColor } = useSelector(
    orderLimitDataSelector,
  );
  const tabsFactories = [
    {
      tabID: TAB_BUY_ID,
      label: 'Buy',
      onChangeTab: () => null,
      titleStyled: { color: buyColor },
      titleDisabledStyled: { color: COLORS.colorGreyMedium },
    },
    {
      tabID: TAB_SELL_ID,
      label: 'Sell',
      onChangeTab: () => null,
      titleStyled: { color: sellColor },
      titleDisabledStyled: { color: COLORS.colorGreyMedium },
    },
  ];
  const handleSelectPercent = (percent) => {
    console.log('percent', percent);
  };
  return (
    <View style={styled.container}>
      <Header title="PRV/XMR" />
      <KeyboardAwareScrollView contentContainerStyle={styled.scrollview}>
        <Tabs rootTabID={ROOT_TAB_ORDER_LIMIT}>
          {tabsFactories.map((tab) => (
            <View key={tab.tabID} {...tab} />
          ))}
        </Tabs>
        <OrderLimitInputsGroup />
        <GroupRate />
        <SelectPercentAmount
          size={4}
          handleSelectPercent={handleSelectPercent}
          containerStyled={styled.selectPercentAmountContainer}
          percentBtnColor={mainColor}
        />
        <GroupActions />
        <SubInfo />
        <OpenOrders />
      </KeyboardAwareScrollView>
    </View>
  );
};

OrderLimit.propTypes = {};

export default withLayout_2(React.memo(OrderLimit));
